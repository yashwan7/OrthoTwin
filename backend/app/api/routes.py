from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, Dict, Any, List
import json
import os
from app.schemas.pydantic_models import (
    PatientInfo, CTUploadResponse, SegmentationResult, LandmarkPoint,
    AnatomicalMeasurements, ImplantSpecs, ImplantPose, KinematicSimulationRequest,
    KinematicSimulationResult, PlanVsRealityComparison, SurgicalReport
)
from app.services.dicom_processor import process_ct_upload
from app.services.segmentation_engine import run_ai_segmentation
from app.services.landmark_detector import get_anatomical_landmarks, get_anatomical_measurements
from app.services.mesh_generator import get_implant_library
from app.services.biomechanics_engine import run_kinematic_simulation
from app.services.plan_vs_reality_engine import compare_plan_vs_postop
from app.services.report_generator import generate_surgical_report
from app.ml.predictor import predictor

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": "OrthoTwin Backend API",
        "version": "1.0.0",
        "ml_model_loaded": predictor.loaded
    }

@router.post("/ml/predict")
async def predict_medical_image(file: UploadFile = File(...)):
    """
    Analyzes an approved medical radiograph / image using the trained ChestXrayResNet14
    deep learning model. Computes 14 thoracic finding probabilities, Grad-CAM attention
    heatmaps, and assigns clinical prioritization.
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    result = predictor.predict(content, filename=file.filename or "scan.png")
    return result

@router.get("/ml/model-info")
def get_model_info():
    """
    Returns architecture specifications and training metadata.
    """
    stats = {}
    if os.path.exists(predictor.stats_path):
        with open(predictor.stats_path, "r") as f:
            stats = json.load(f)
    return {
        "model_architecture": "ChestXrayResNet14",
        "input_channels": 1,
        "input_resolution": "28x28 (MedMNIST standard benchmark)",
        "num_classes": 14,
        "explainability": "Grad-CAM (Layer 4 Activation Gradients)",
        "dataset": "NIH ChestX-ray14 Benchmark (ChestMNIST v2)",
        "dataset_statistics": stats
    }

@router.get("/ml/evaluation")
def get_evaluation_report():
    """
    Returns independent test evaluation metrics on 22,433 held-out images.
    """
    if os.path.exists(predictor.eval_path):
        with open(predictor.eval_path, "r") as f:
            return json.load(f)
    return {"error": "Evaluation report not found."}

@router.post("/ct/upload")
def upload_ct(file: Optional[UploadFile] = File(None)):
    filename = file.filename if file else "demo_shoulder_ct.zip"
    res = process_ct_upload(file_count=240, filename=filename)
    return res

@router.post("/segmentation/run")
def run_segmentation():
    return run_ai_segmentation()

@router.get("/landmarks")
def get_landmarks():
    return get_anatomical_landmarks()

@router.get("/measurements")
def get_measurements():
    return get_anatomical_measurements()

@router.get("/implants")
def get_implants():
    return get_implant_library()

@router.post("/simulation")
def simulate_kinematics(req: KinematicSimulationRequest):
    pose_dict = req.pose.model_dump()
    return run_kinematic_simulation(
        pose=pose_dict,
        flexion_deg=req.flexion_deg,
        abduction_deg=req.abduction_deg,
        internal_rotation_deg=req.internal_rotation_deg
    )

@router.post("/plan-vs-postop")
def plan_vs_postop(planned_pose: ImplantPose, postop_pose: Optional[ImplantPose] = None):
    p_dict = planned_pose.model_dump()
    po_dict = postop_pose.model_dump() if postop_pose else None
    return compare_plan_vs_postop(planned_pose=p_dict, postop_pose=po_dict)

@router.post("/report")
def create_report(data: Dict[str, Any]):
    patient = data.get("patient", PatientInfo().model_dump())
    measurements = data.get("measurements", get_anatomical_measurements())
    implants = get_implant_library()
    implant = data.get("implant", implants[0])
    planned_pose = data.get("planned_pose", ImplantPose(implant_id=implant["id"]).model_dump())
    simulation = data.get("simulation", run_kinematic_simulation(planned_pose))
    plan_vs_reality = data.get("plan_vs_reality", compare_plan_vs_postop(planned_pose))

    return generate_surgical_report(
        patient=patient,
        measurements=measurements,
        implant=implant,
        planned_pose=planned_pose,
        simulation=simulation,
        plan_vs_reality=plan_vs_reality
    )
