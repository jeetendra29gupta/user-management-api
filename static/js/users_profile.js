async function usersProfile(user_id) {
    if (!user_id) {
        alert("User ID is required to fetch user information.");
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

            //alert(`User Info:\n${JSON.stringify(successDetails, null, 2)}`);
            console.log(successDetails);
            showUserInfoModal(userInfo);

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


function showUserInfoModal(userInfo) {
    const modal = document.getElementById('userInfoModal');
    const content = document.getElementById('userInfoContent');
    content.innerHTML = '';
    //content.textContent = JSON.stringify(userInfo, null, 2);
    content.innerHTML = `
        <table class="w3-table-all w3-hoverable" id="user-table">
            <tr class="${userInfo.is_active ? 'w3-pale-green' : 'w3-pale-red'}">
                <td>Name: </td><td>${userInfo.full_name}</td>
            </tr>
            <tr>
                <td>Username: </td><td>${userInfo.username}</td>
            </tr>
            <tr>
                <td>Email ID: </td><td>${userInfo.email}</td>
            </tr>
            <tr>
                <td>Phone Number: </td><td>${userInfo.phone_number}</td>
            </tr>
            <tr>
                <td>Create At: </td><td>${formatDate(userInfo.created_at)}</td>
            </tr>
        </table>
    `;
    modal.style.display = 'block';
}

function closeUserInfoModal() {
    document.getElementById('userInfoModal').style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date)) {
        console.error("Invalid date format");
        return null;
    }

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    });
}

