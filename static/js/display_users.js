async function displayUsers() {
  try {
    const response = await fetch('http://127.0.0.1:8181/users');
    const users = await response.json();

    if (response.ok) {
      showUsers(users);
      console.log({
        'Success Message': 'Users fetched successfully!',
        'Status Code': response.status,
        'Status Message': response.statusText,
      });
    } else {
      console.error({
        'Error Message': 'Error fetching users',
        'Details': users,
        'Status Code': response.status,
        'Status Message': response.statusText,
      });
      alert(`Error fetching users: ${JSON.stringify(users, null, 2)}`);
    }
  } catch (error) {
    console.error({
      'Error Message': 'Fetch error',
      'Details': error.message,
    });
    alert(`Fetch error: ${error.message}`);
  }
}

function showUsers(users) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';

  if (users.length === 0) {
    userList.innerHTML = `
        <table class="w3-table-all w3-hoverable" id="user-table">
            <tbody>
                <tr>
                    <td class="w3-center w3-red"><b>No users found.</b></td>
                </tr>
            </tbody>
        </table>
    `;
    return;
  }

  let table = `
    <table class="w3-table-all w3-hoverable" id="user-table">
        <thead>
            <tr><th>Full Name</th><th>Username</th><th>Actions</th></tr>
        </thead>
        <tbody>
  `;
  users.forEach(user => {
    table += `
        <tr class="${user.is_active ? 'w3-pale-green w3-hover-green' : 'w3-pale-red w3-hover-red'}">
            <td style="vertical-align: middle">${user.full_name}</td>
            <td style="vertical-align: middle">${user.username}</td>
            <td>
                <button class="w3-button w3-round" onclick="usersProfile('${user._id}')">
                <img src="static/images/information.png" alt="Information" width="24"
                         height="24" title="Information" style="vertical-align: middle">
                </button>

                <button class="w3-button" onclick="updateUser('${user._id}')">
                <img src="static/images/edit.png" alt="Edit" width="24"
                         height="24" title="Edit" style="vertical-align: middle">
                </button>

                <button class="w3-button" onclick="deleteUsers('${user._id}')">
                <img src="static/images/delete.png" alt="Delete" width="24"
                         height="24" title="Delete" style="vertical-align: middle">
                </button>

                <button class="w3-button" onclick="toggleUserStatus('${user._id}', ${user.is_active})">
                    <img src="static/images/${user.is_active ? 'disable.png' : 'enable.png'}"
                    alt="${user.is_active ? 'Disable' : 'Enable'}" width="24" height="24"
                    title="${user.is_active ? 'Disable' : 'Enable'}" style="vertical-align: middle">
                </button>
            </td>
        </tr>
    `;
  });
  table += `</tbody></table>`;
  userList.innerHTML = table;

  console.log({
    'Success Message': 'Users displayed successfully!',
    'User Count': users.length,
  });
}

window.onload = displayUsers;