from database import db

class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(200),
        nullable=False
    )

    def __repr__(self):

        return f"<User {self.username}>"
    
class Project(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(100),
        nullable=False
    )

    result = db.Column(db.Text)

    project_name = db.Column(
        db.String(200)
    )

    company_name = db.Column(
        db.String(200)
    )

    engineer_name = db.Column(
        db.String(200)
    )

    notes = db.Column(
        db.Text
    )

    membrane_size = db.Column(
        db.String(50)
    )

    selected_membrane = db.Column(db.String(100))

    feed_tds = db.Column(
        db.Float
    )

    recovery = db.Column(
        db.Float
    )

    temperature = db.Column(
        db.Float
    )

    feed_flow = db.Column(
        db.Float
    )

    water_type = db.Column(
        db.String(100)
    )

    membrane = db.Column(
        db.String(200)
    )

    product_flow = db.Column(
        db.Float
    )

    feed_pressure = db.Column(
        db.Float
    )

    product_tds = db.Column(
        db.Float
    )

    flux = db.Column(
        db.Float
    )

    salt_rejection = db.Column(
        db.Float
    )

    osmotic_pressure = db.Column(
        db.Float
    )

    scaling_risk = db.Column(
        db.String(100)
    )

    fouling_risk = db.Column(
        db.String(100)
    )

    recommendation = db.Column(
        db.Text
    )

    pH = db.Column(db.Float)

    calcium = db.Column(db.Float)

    magnesium = db.Column(db.Float)

    sodium = db.Column(db.Float)

    potassium = db.Column(db.Float)

    chloride = db.Column(db.Float)

    sulfate = db.Column(db.Float)

    bicarbonate = db.Column(db.Float)

    silica = db.Column(db.Float)

    ammonium = db.Column(db.Float)

    strontium = db.Column(db.Float)

    barium = db.Column(db.Float)

    carbonate = db.Column(db.Float)

    nitrate = db.Column(db.Float)

    fluoride = db.Column(db.Float)

    boron = db.Column(db.Float)

    stages = db.Column(db.Integer)
    
    pressure_vessels = db.Column(db.Integer)
    
    elements_per_vessel = db.Column(db.Integer)
    
    pump_efficiency = db.Column(db.Float)
    
    system_feed_pressure = db.Column(db.Float)