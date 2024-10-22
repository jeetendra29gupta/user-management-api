async function toggleUserStatus(user_id, status) {
    if (!user_id) {
        alert("User ID is required to toggle status.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8181/user/${user_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: !status }),
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

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);

        } else {
            const errorDetails = {
                'Error Message': result,
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
            'Status Message': 'Failed to fetch data',
        };

        alert(`Fetch error: ${JSON.stringify(fetchErrorDetails, null, 2)}`);
        console.error(fetchErrorDetails);
    }
}