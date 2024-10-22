async function updateUser(user_id) {
    if (!user_id) {
        alert("User ID is required for updation.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8181/user/${user_id}`);
        const userInfo = await response.json();

        if (response.ok) {
            const successDetails = {
                'User Info': userInfo,
                'Status Code': response.status,
                'Status Message': response.statusText,
            };

            // alert(`User Info:\n${JSON.stringify(successDetails, null, 2)}`);
            console.log(successDetails);

            document.getElementById('edit-user-id').value = userInfo._id;
            let full_name = userInfo.full_name.split(' ');
            document.getElementById('edit-first-name').value = full_name[0];
            document.getElementById('edit-last-name').value = full_name[1];
            document.getElementById('edit-username').value = userInfo.username;
            document.getElementById('edit-email').value = userInfo.email;
            document.getElementById('edit-mobile').value = userInfo.phone_number;
            document.getElementById('edit_user_modal').style.display = 'block';

        } else {
            const errorDetails = {
                'Error Message': userInfo,
                'Status Code': response.status,
                'Status Message': response.statusText,
            };

            alert(`Error: ${JSON.stringify(errorDetails, null, 2)}`);
            console.error(errorDetails);
        }

    } catch (error) {
        console.error('Fetch error:', error);
        const fetchErrorDetails = {
            'Error Message': error.message,
            'Status Code': 'Network Error',
            'Status Message': 'Failed to fetch user data',
        };

        console.error(fetchErrorDetails);
        alert(`Fetch error: ${JSON.stringify(fetchErrorDetails, null, 2)}`); // Show fetch error in pretty JSON format
    }

}

async function editUser(event) {
    event.preventDefault();

    const userId = document.getElementById('edit-user-id').value;
    const formData = new FormData(document.getElementById('edit-user-form'));
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`http://127.0.0.1:8181/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();

        if (response.ok) {
            const successDetails = {
                'Success Message': result,
                'Status Code': response.status,
                'Status Message': response.statusText,
            };

            //alert(`Success: ${JSON.stringify(successDetails, null, 2)}`);
            console.log(successDetails);

            setTimeout(function() {
                document.getElementById('edit-user-form').reset();
                document.getElementById('edit_user_modal').style.display = 'none';
                window.location.href = '/';
            }, 1000);

        } else {
            const errorDetails = {
                'Error Message': result,
                'Status Code': response.status,
                'Status Message': response.statusText,
                'Error updating user': result.message,
            };
            console.error(errorDetails);
            alert(`Error: ${JSON.stringify(errorDetails, null, 2)}`);
        }

    } catch (error) {
        console.error('Fetch error:', error);
        const fetchErrorDetails = {
            'Error Message': error.message,
            'Status Code': 'Network Error',
            'Status Message': 'Failed to fetch data',
        };
        alert(`Fetch error: ${JSON.stringify(fetchErrorDetails, null, 2)}`);
    }
}
