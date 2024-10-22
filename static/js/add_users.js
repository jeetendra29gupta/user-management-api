async function addUsers(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('add-user-form'));
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://127.0.0.1:8181/user', {
            method: 'POST',
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
                document.getElementById('add-user-form').reset();
                document.getElementById('add_user_modal').style.display = 'none';
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