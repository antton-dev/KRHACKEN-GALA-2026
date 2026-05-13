from sqlmodel import Session
from database import engine, create_db_and_tables
from models import Celebrity

def fill_data():
    create_db_and_tables()

    celebrities_test = [
        {"name": "Jean Dujardin", "image": "dujardin.png"},
        {"name": "Marion Cotillard", "image": "cotillard.jpg"},
        {"name": "Omar Sy", "image": "omarsy.jpg"},
        {"name": "Leonardo DiCaprio", "image": "dicaprio.jpg"},
        {"name": "Scarlett Johansson", "image": "johansson.jpg"},
        {"name": "Brad Pitt", "image": "pitt.jpg"},
        {"name": "Angelina Jolie", "image": "jolie.jpg"},
        {"name": "Tom Cruise", "image": "cruise.jpg"},
        {"name": "Natalie Portman", "image": "portman.jpg"},
        {"name": "Will Smith", "image": "smith.jpg"},
        {"name": "Emma Watson", "image": "watson.jpg"},
        {"name": "Johnny Depp", "image": "depp.jpg"},
        {"name": "Julia Roberts", "image": "roberts.jpg"},
        {"name": "George Clooney", "image": "clooney.jpg"},
        {"name": "Meryl Streep", "image": "streep.jpg"}
    ]

    with Session(engine) as session :
        if session.query(Celebrity).count() == 0: 
            print("Adding celebrities...")

            for c in celebrities_test:
                new = Celebrity(name=c["name"], image="image/"+c["image"])
                session.add(new)

            session.commit()
            print("Database filled with success")
        else:
            print('Database already contains data')

if __name__ == "__main__":
    fill_data()