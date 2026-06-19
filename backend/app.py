from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from flask_bcrypt import Bcrypt
from models import User, Project
import json
import os

app = Flask(__name__)

bcrypt = Bcrypt(app)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*"
        }
    }
)

database_url = os.getenv("DATABASE_URL")

if database_url:
    database_url = database_url.replace(
        "postgres://",
        "postgresql://",
        1
    )

app.config["SQLALCHEMY_DATABASE_URI"] = (
    database_url or "sqlite:///ro_system.db"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

def to_float(value):
    try:
        return float(value) if value not in [None, ""] else None
    except:
        return None

# MEMBRANE DATABASE

membranes = [

    {
        "name": "SW30HRLE-400",
        "max_tds": 45000
    },

    {
        "name": "BW30XFR-400",
        "max_tds": 10000
    },

    {
        "name": "LP21-4040",
        "max_tds": 3000
    }

]

# HOME ROUTE

@app.route("/")

def home():

    return "RO Backend Running"

# PREDICTION ROUTE

@app.route("/signup", methods=["POST"])

def signup():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    existing_user = User.query.filter_by(
        username=username
    ).first()

    if existing_user:

        return jsonify({
            "message":
            "User already exists"
        }), 400

    hashed_password = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")

    new_user = User(
        username=username,
        password=hashed_password
    )

    db.session.add(new_user)

    db.session.commit()

    return jsonify({
        "message":
        "User created successfully"
    })
    
@app.route("/login", methods=["POST"])

def login():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(
        username=username
    ).first()

    if not user:

        return jsonify({
            "message":
            "Invalid username"
        }), 401

    password_correct = bcrypt.check_password_hash(
        user.password,
        password
    )

    if not password_correct:

        return jsonify({
            "message":
            "Invalid password"
        }), 401

    return jsonify({
        "message":
        "Login successful"
    })

@app.route("/save_project", methods=["POST"])

def save_project():

    data = request.json

    result = json.dumps(
    data.get("result", {})
)

    project = Project(

        username=data.get("username"),

        result=result,

        project_name=data.get("project_name"),

        company_name=data.get("company_name"),

        engineer_name=data.get("engineer_name"),

        notes=data.get("notes"),

        membrane_size=data.get(
            "membrane_size"
        ),

        feed_tds=data.get("feed_tds"),

        recovery=data.get("recovery"),

        temperature=data.get("temperature"),

        feed_flow=data.get("feed_flow"),

        water_type=data.get("water_type"),

        membrane=data.get("result", {}).get("membrane"),

        selected_membrane=data.get("selected_membrane"),

        product_flow=data.get("result", {}).get(
            "product_flow_rate"
        ),

        feed_pressure=data.get("result", {}).get(
            "feed_pressure"
        ),

        product_tds=data.get("result", {}).get(
            "product_tds"
        ),

        flux=data.get("result", {}).get("flux"),

        salt_rejection=data.get("result", {}).get(
            "salt_rejection"
        ),

        osmotic_pressure=data.get("result", {}).get(
            "osmotic_pressure"
        ),

        scaling_risk=data.get("result", {}).get(
            "scaling_risk"
        ),

        fouling_risk=data.get("result", {}).get(
            "fouling_risk"
        ),

        pH=float(data["pH"]) if data.get("pH") else None,

        calcium=float(data["calcium"]) if data.get("calcium") else None,

        magnesium=float(data["magnesium"]) if data.get("magnesium") else None,

        sodium=float(data["sodium"]) if data.get("sodium") else None,

        potassium=float(data["potassium"]) if data.get("potassium") else None,

        chloride=float(data["chloride"]) if data.get("chloride") else None,

        sulfate=float(data["sulfate"]) if data.get("sulfate") else None,

        bicarbonate=float(data["bicarbonate"]) if data.get("bicarbonate") else None,

        silica=float(data["silica"]) if data.get("silica") else None,

        ammonium=to_float(data.get("ammonium")),

        strontium=to_float(data.get("strontium")),

        barium=to_float(data.get("barium")),

        carbonate=to_float(data.get("carbonate")),

        nitrate=to_float(data.get("nitrate")),

        fluoride=to_float(data.get("fluoride")),

        boron=to_float(data.get("boron")),

        stages=data.get("stages"),
        
        pressure_vessels=data.get("pressure_vessels"),

        elements_per_vessel=data.get("elements_per_vessel"),
        
        pump_efficiency=data.get("pump_efficiency"),
        
        system_feed_pressure=data.get("system_feed_pressure"),

        recommendation=data.get("result", {}).get(
            "recommendation"
        )

    )

    db.session.add(project)

    db.session.commit()

    return jsonify({
        "message":
        "Project Saved Successfully"
    })

@app.route("/projects/<username>", methods=["GET"])

def get_projects(username):

    projects = Project.query.filter_by(
        username=username
    ).all()

    project_list = []

    for project in projects:

        project_list.append({

    "id": project.id,

    "result": project.result,

    "project_name": project.project_name,

    "company_name": project.company_name,

    "engineer_name": project.engineer_name,

    "notes": project.notes,

    "feed_tds": project.feed_tds,

    "recovery": project.recovery,

    "temperature": project.temperature,

    "feed_flow": project.feed_flow,

    "water_type": project.water_type,

    "membrane": project.membrane,

    "membrane_size": project.membrane_size,

    "selected_membrane": project.selected_membrane,

    "product_flow": project.product_flow,

    "feed_pressure": project.feed_pressure,

    "product_tds": project.product_tds,

    "flux": project.flux,

    "salt_rejection": project.salt_rejection,

    "osmotic_pressure": project.osmotic_pressure,

    "scaling_risk": project.scaling_risk,

    "fouling_risk": project.fouling_risk,

    "pH": project.pH,

    "calcium": project.calcium,

    "magnesium": project.magnesium,

    "sodium": project.sodium,

    "potassium": project.potassium,

    "chloride": project.chloride,

    "sulfate": project.sulfate,

    "bicarbonate": project.bicarbonate,

    "silica": project.silica,

    "ammonium": project.ammonium,

    "strontium": project.strontium,

    "barium": project.barium,

    "carbonate": project.carbonate,

    "nitrate": project.nitrate,

    "fluoride": project.fluoride,

    "boron": project.boron,

    "stages": project.stages,
    
    "pressure_vessels": project.pressure_vessels,
    
    "elements_per_vessel": project.elements_per_vessel,
    
    "pump_efficiency": project.pump_efficiency,
    
    "system_feed_pressure": project.system_feed_pressure,

    "recommendation": project.recommendation

})
    return jsonify(project_list)

@app.route("/project/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):

    project = Project.query.get(project_id)

    if not project:
        return jsonify({
            "message": "Project not found"
        }), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({
        "message": "Project deleted successfully"
    })

@app.route("/predict", methods=["POST"])

def predict():

    data = request.json

    print("PREDICT DATA:", data)

    recovery = float(data.get("recovery") or 0)

    temperature = float(data.get("temperature") or 25)

    feed_flow = float(data.get("feedFlow") or 0)

    feed_tds = float(data.get("feedTDS") or 0)
    water_type = data["waterType"]
   
    # MEMBRANE SELECTION

    selected_membrane = "SW30HRLE-400"

    for membrane in membranes:

        if feed_tds <= membrane["max_tds"]:

            selected_membrane = membrane["name"]

            break


# ==========================
# CALCULATIONS
# ==========================

    membrane_data = data.get(
    "membraneData",
        {}
    )

    selected_membrane = data.get(
       "selectedMembrane",
       "Unknown"
    )

    max_pressure = membrane_data.get(
       "max_pressure",
        40
    )   

    salt_rejection_base = membrane_data.get(
       "salt_rejection",
        99.5
    )

    recovery_limit = membrane_data.get(
       "recovery_limit",
        45
    )

    membrane_size = data.get(
       "membraneSize",
       "4 x 40"
    )

# ==========================
# MEMBRANE AREA
# ==========================

    if membrane_size == "2.5 x 14":
       membrane_area = 2.6

    elif membrane_size == "2.5 x 21":
       membrane_area = 4.0

    elif membrane_size == "2.5 x 40":
       membrane_area = 2.83

    elif membrane_size == "4 x 40":
       membrane_area = 7.9

    elif membrane_size == "8 x 40":
       membrane_area = 37

    elif membrane_size == "8 x 80":
       membrane_area = 40

    elif membrane_size == "14 x 80":
       membrane_area = 70

    else:
       membrane_area = 37

# ==========================
# FACTORS
# ==========================

    tcf = 1 + ((temperature - 25) * 0.015)

    recovery_factor = (
       1 +
       ((recovery - 50) * 0.01)
    )

    flow_factor = (
        feed_flow / 500
    )

    area_factor = (
        membrane_area / 37
    )

# ==========================
# OSMOTIC PRESSURE
# ==========================

    osmotic_pressure = round(
       feed_tds *
       0.0018 *
       tcf *
       recovery_factor,
       2
    )

# ==========================
# PRESSURE
# ==========================

    if water_type == "Ground Water":

       base_pressure = 6

    elif water_type == "Brackish Water":

       base_pressure = 12

    else:

       base_pressure = 15.4

    feed_pressure = round(

      base_pressure +

      (osmotic_pressure * 0.55) +

      (recovery * 0.55) -

      ((temperature - 25) * 0.55) +

      ((flow_factor - 1) * 12),

      2

)
# membrane size effect

    if membrane_area < 10:

       feed_pressure *= 1.08

    elif membrane_area > 37:

       feed_pressure *= 0.92

    feed_pressure = round(
       feed_pressure,
       2
    )

    feed_pressure = min(
       feed_pressure,
       max_pressure
    )

# ==========================
# PRODUCT FLOW
# ==========================

    product_flow = round(
    recovery * 5,
    2
)
    

# ==========================
# SALT REJECTION
# ==========================

    salt_rejection = (
    98.4 +
    (recovery * 0.04)
    - ((temperature - 25) * 0.08)
    + ((flow_factor - 1) * 1.2)
)
    salt_rejection = min(
        salt_rejection,
        99.5
    )

# ==========================
# PRODUCT TDS
# ==========================

    product_tds = (
        feed_tds *
        (1 - salt_rejection / 100)
    )



    product_tds = round(product_tds, 2)

# ==========================
# FLUX
# ==========================

    if membrane_size == "2.5 x 40":
       effective_area = 2.83
    else:
       effective_area = membrane_area

    flux = round(
       product_flow / effective_area,
       2
    )

# ==========================
# SCALING RISK
# ==========================

    scaling_score = 0

    if feed_tds > 1000:
       scaling_score += 1

    if feed_tds > 5000:
       scaling_score += 1

    if feed_tds > 30000:
       scaling_score += 2

    if recovery > 60:
       scaling_score += 1

    if temperature > 35:
       scaling_score += 1

    if flux > 15:
       scaling_score += 1

    if scaling_score >= 4:

       scaling_risk = "HIGH"

    elif scaling_score >= 2:

       scaling_risk = "MEDIUM"

    else:

       scaling_risk = "LOW"

# ==========================
# FOULING RISK
# ==========================

    fouling_score = 0

    if feed_tds > 10000:
       fouling_score += 1

    if membrane_area < 10:
       fouling_score += 1

    if flux > 15:
       fouling_score += 1

    if flux > 25:
       fouling_score += 1

    if recovery > 70:
        fouling_score += 1

    if water_type.lower() == "sea water":
        fouling_score += 1

    if feed_flow > 1000:
       fouling_score += 1

    if fouling_score >= 5:

       fouling_risk = "HIGH"

    elif fouling_score >= 3:

       fouling_risk = "MEDIUM"

    else:

       fouling_risk = "LOW"

    # RECOMMENDATIONS

    recommendation = ""
 
    if feed_tds > 30000:

        recommendation = (
            "High salinity water detected. "
            "Use high-pressure seawater membrane "
            "with energy recovery system."
       )

    elif recovery > 70:

        recommendation = (
            "High recovery may increase scaling risk. "
            "Pretreatment strongly recommended."
        )

    else:

        recommendation = (
            "System operating within safe limits."
       )
        
# ==========================
# RECOVERY WARNING
# ==========================

    if recovery > recovery_limit:
        warning = (
           f"Recovery exceeds membrane limit ({recovery_limit}%)."
        )
    else:
        warning = ""
        
    # RESPONSE

    return jsonify({

        "recommendation": recommendation,

        "membrane": selected_membrane,

        "membrane_size": membrane_size,

        "membrane_area": membrane_area,

        "product_flow_rate": product_flow,

        "feed_pressure": feed_pressure,

        "product_tds": product_tds,

        "flux": flux,

        "salt_rejection": salt_rejection,

        "osmotic_pressure": osmotic_pressure,

        "scaling_risk": scaling_risk,

        "fouling_risk": fouling_risk,

        "recommendation": recommendation,

        "warning": warning,

        "selected_membrane": selected_membrane,

        "membrane_max_pressure": max_pressure,

        "recovery_limit": recovery_limit,

    })

# RUN SERVER
with app.app_context():

    db.create_all()

if __name__ == "__main__":

    app.run(debug=True)