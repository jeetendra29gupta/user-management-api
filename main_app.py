from datetime import datetime, timezone

from bson.objectid import ObjectId
from flask import Flask
from flask import render_template, request, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/local_database'
mongo = PyMongo()
mongo.init_app(app)
database = mongo.db

@app.before_request
def create_indexes():
    # Ensure MongoDB indexes for optimization
    database.users.create_index([('username', 1)], unique=True)
    database.users.create_index([('email', 1)], unique=True)
    database.users.create_index([('phone_number', 1)], unique=True)
    print("Indexes created.")




# Home route
@app.route('/')
def home():
    """
    Home route - renders the index.html template.
    """
    return render_template('index.html')


# Route to create a new user
@app.route('/user', methods=['POST'])
def create_user():
    """
    Route to create a new user.

    - Validates incoming JSON data for required fields.
    - Checks if username, email, or phone number already exist (conflicts).
    - If no conflicts, creates and stores the new user in the MongoDB database.

    Returns:
        - 201 status and user ID if successful.
        - 400 status with an error message if required fields are missing or conflicts exist.
    """
    data = request.json
    print(data)
    required_fields = ['first_name', 'last_name', 'username', 'email', 'mobile_number']

    # Check for missing fields
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Check for existing user conflicts
    existing_user = database.users.find_one({
        '$or': [
            {'username': data['username']},
            {'email': data['email']},
            {'phone_number': data['mobile_number']}
        ]
    })

    if existing_user:
        conflicts = []
        if existing_user.get('username') == data['username']:
            conflicts.append('username')
        if existing_user.get('email') == data['email']:
            conflicts.append('email')
        if existing_user.get('phone_number') == data['mobile_number']:
            conflicts.append('mobile number')
        return jsonify({'message': f'Conflict with existing {", ".join(conflicts)}'}), 400

    # Create new user object
    user = {
        "full_name": f"{data['first_name']} {data['last_name']}",
        "username": data['username'],
        "email": data['email'],
        "phone_number": data['mobile_number'],
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    # Insert user into the database
    result = database.users.insert_one(user)
    return jsonify({'message': 'User created successfully!', 'user_id': str(result.inserted_id)}), 201


# Route to get all users
@app.route('/users', methods=['GET'])
def get_all_users():
    """
    Route to retrieve all users from the database.

    Returns:
        - 200 status with a list of all users.
        - 500 status with an error message if an exception occurs.
    """
    try:
        users = list(database.users.find())
        for user in users:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred while retrieving users', 'error': str(e)}), 500


# Route to get a user by ID
@app.route('/user/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    """
    Route to retrieve a specific user by their ID.

    Args:
        user_id (str): The ID of the user to retrieve.

    Returns:
        - 200 status and the user data if found.
        - 404 status if the user is not found.
        - 500 status if an error occurs during retrieval.
    """
    try:
        user = database.users.find_one({'_id': ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
            return jsonify(user), 200
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'message': 'An error occurred while retrieving the user', 'error': str(e)}), 500


# Route to update a user by ID
@app.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Route to update an existing user's details by their ID.

    Args:
        user_id (str): The ID of the user to update.

    Returns:
        - 200 status if the update is successful.
        - 404 status if the user is not found.
        - 400 status if required fields are missing.
    """
    data = request.json
    required_fields = ['first_name', 'last_name', 'username', 'email', 'mobile_number']

    # Check for missing fields
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Updated user object
    user = {
        "full_name": f"{data['first_name']} {data['last_name']}",
        "username": data['username'],
        "email": data['email'],
        "phone_number": data['mobile_number'],
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    # Update the user in the database
    result = database.users.update_one({'_id': ObjectId(user_id)}, {'$set': user})
    if result.matched_count > 0:
        return jsonify({'message': 'User updated successfully'}), 200
    return jsonify({'message': 'User not found'}), 404


# Route to partially update a user's status
@app.route('/user/<user_id>', methods=['PATCH'])
def partially_update_user(user_id):
    """
    Route to partially update a user's details (e.g., is_active status).

    Args:
        user_id (str): The ID of the user to update.

    Returns:
        - 200 status if the partial update is successful.
        - 404 status if the user is not found.
        - 400 status if required fields are missing.
    """
    data = request.json

    # Check if the 'is_active' field is being updated
    if "is_active" in data:
        user = {"is_active": data['is_active']}
        result = database.users.update_one({'_id': ObjectId(user_id)}, {'$set': user})

        if result.matched_count > 0:
            return jsonify({'message': 'User status updated successfully'}), 200
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'message': 'Missing required fields'}), 400


# Route to delete a user by ID
@app.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Route to delete a user by their ID.

    Args:
        user_id (str): The ID of the user to delete.

    Returns:
        - 200 status if the deletion is successful.
        - 404 status if the user is not found.
    """
    result = database.users.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count > 0:
        return jsonify({'message': 'User deleted successfully'}), 200
    return jsonify({'message': 'User not found'}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8181, debug=True)
