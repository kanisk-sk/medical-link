import uuid
import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.models import (
    User, UserRole, PatientProfile, VitalsRecord,
    Consultation, Prescription, PharmacyItem, EmergencyAlert, PriorityEnum
)

def seed_database():
    print("🌱 Initializing PostgreSQL Database Schema & Seeding Initial Data...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Demo Login User
        demo_user = db.query(User).filter(User.email == "dummy@gmail.com").first()
        if not demo_user:
            demo_user = User(
                id="usr_dummy_101",
                email="dummy@gmail.com",
                password_hash="user12345_hash",  # Demo credentials
                name="Gurpreet Singh",
                phone="+91 98765 43210",
                role=UserRole.PATIENT,
                language="ta",
                village="Alhoran"
            )
            db.add(demo_user)
            db.commit()
            print("  ✅ Created Login User: dummy@gmail.com")

        # 2. Seed Doctor Users
        dr_amanpreet = db.query(User).filter(User.email == "dr.amanpreet@sehatlink.gov.in").first()
        if not dr_amanpreet:
            dr_amanpreet = User(
                id="usr_doc_201",
                email="dr.amanpreet@sehatlink.gov.in",
                password_hash="doc12345_hash",
                name="Dr. Amanpreet Singh (MD Internal Medicine)",
                phone="+91 98123 45678",
                role=UserRole.DOCTOR,
                language="en",
                village="Sector 1"
            )
            db.add(dr_amanpreet)
            db.commit()
            print("  ✅ Created Doctor: Dr. Amanpreet Singh")

        # 3. Seed Patient Profile & ABHA Healthcard
        patient = db.query(PatientProfile).filter(PatientProfile.id == "pat_101").first()
        if not patient:
            patient = PatientProfile(
                id="pat_101",
                user_id=demo_user.id,
                name="Gurpreet Singh",
                abha_id="91-4820-1928-3741",
                abha_address="gurpreet.singh@abdm",
                age=60,
                gender="Male",
                village="Alhoran",
                blood_group="O+",
                phone="+91 98765 43210",
                emergency_contact="+91 98765 00000",
                qr_code_data="ABHA:91-4820-1928-3741|NAME:Gurpreet Singh|AGE:60|VILLAGE:Alhoran"
            )
            db.add(patient)
            db.commit()
            print("  ✅ Created Patient Profile with ABHA Card: 91-4820-1928-3741")

        # 4. Seed Vitals Record
        vitals = db.query(VitalsRecord).filter(VitalsRecord.patient_id == "pat_101").first()
        if not vitals:
            vitals = VitalsRecord(
                id="vit_301",
                patient_id="pat_101",
                temperature=37.8,
                blood_pressure_systolic=155,
                blood_pressure_diastolic=95,
                pulse_rate=104,
                spo2=88,
                recorded_by="Harpreet Kaur (ASHA Worker)"
            )
            db.add(vitals)
            db.commit()
            print("  ✅ Created Vitals Record (SpO2 Alert: 88%)")

        # 5. Seed Appointments
        appointment1 = db.query(Consultation).filter(Consultation.id == "apt_401").first()
        if not appointment1:
            appointment1 = Consultation(
                id="apt_401",
                patient_id="pat_101",
                doctor_id="usr_doc_201",
                doctor_name="Dr. Amanpreet Singh",
                priority=PriorityEnum.HIGH,
                status="scheduled",
                scheduled_time="Today, 11:30 AM",
                symptoms_summary="Chest discomfort, mild fever (37.8°C), SpO2 88%"
            )
            db.add(appointment1)
            db.commit()
            print("  ✅ Created Doctor Appointment: Dr. Amanpreet Singh (Today, 11:30 AM)")

        # 6. Seed Digital Prescription
        prescription = db.query(Prescription).filter(Prescription.id == "rx_501").first()
        if not prescription:
            prescription = Prescription(
                id="rx_501",
                consultation_id="apt_401",
                patient_id="pat_101",
                doctor_name="Dr. Amanpreet Singh (MD)",
                doctor_license="PMC-2018-84920",
                hospital_name="Government Civil Hospital",
                diagnosis="Acute Bronchitis & Mild Hypoxia",
                medications_json='[{"name":"Paracetamol 500mg","dosage":"1 tablet twice daily after food","duration":"5 days"},{"name":"Amoxicillin 500mg","dosage":"1 capsule 3 times daily","duration":"7 days"},{"name":"Salbutamol Inhaler","dosage":"2 puffs as needed for shortness of breath","duration":"14 days"}]',
                digital_signature="SIG_AMANPREET_VERIFIED_84920"
            )
            db.add(prescription)
            db.commit()
            print("  ✅ Created Digital Prescription (E-Signed)")

        # 7. Seed Jan Aushadhi Pharmacy Stock
        med1 = db.query(PharmacyItem).filter(PharmacyItem.medicine_name == "Paracetamol 500mg").first()
        if not med1:
            meds = [
                PharmacyItem(id="med_601", medicine_name="Paracetamol 500mg", generic_name="Acetaminophen", stock_status="in_stock", quantity=450, price_in_inr=12.50, pharmacy_name="Main Kendra #1", pharmacy_address="Near Civil Hospital Gate, Rural", distance_km=0.8, contact_number="+91 98765 11111"),
                PharmacyItem(id="med_602", medicine_name="Amoxicillin 500mg", generic_name="Amoxicillin Trihydrate", stock_status="in_stock", quantity=200, price_in_inr=42.00, pharmacy_name="Main Kendra #1", pharmacy_address="Near Civil Hospital Gate, Rural", distance_km=0.8, contact_number="+91 98765 11111"),
                PharmacyItem(id="med_603", medicine_name="Salbutamol Inhaler 100mcg", generic_name="Albuterol", stock_status="low_stock", quantity=15, price_in_inr=85.00, pharmacy_name="Alhoran Rural Kendra", pharmacy_address="Village Bus Stand, Alhoran", distance_km=2.4, contact_number="+91 98765 22222")
            ]
            db.add_all(meds)
            db.commit()
            print("  ✅ Created Jan Aushadhi Pharmacy Inventory")

        # 8. Seed Emergency 108 Dispatch Log
        alert = db.query(EmergencyAlert).filter(EmergencyAlert.id == "sos_701").first()
        if not alert:
            alert = EmergencyAlert(
                id="sos_701",
                patient_id="pat_101",
                patient_name="Gurpreet Singh",
                village="Alhoran",
                lat=30.3753,
                lng=76.1534,
                status="dispatched",
                ambulance_unit="108 Dispatch Unit #4"
            )
            db.add(alert)
            db.commit()
            print("  ✅ Created Emergency 108 Dispatch Log")

        print("🎉 Database successfully initialized and seeded with all tables!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
