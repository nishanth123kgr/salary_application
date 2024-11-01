import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('sal-slip-firebase-adminsdk-eajfq-deb68f73c6.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

def get_staffs(db):
    users_ref = db.collection("staff_id")
    docs = users_ref.stream()

    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
        
get_staffs(db)
    
doc_ref = db.collection("staff_id").document("alovelace")
doc_ref.set({"first": "Ada", "last": "Lovelace", "born": 1815})

get_staffs(db)
