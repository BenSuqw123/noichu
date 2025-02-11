document.addEventListener('DOMContentLoaded', () => {
    const makeRoom = document.getElementById('makeRoom')
    const createRoom = document.querySelector(".createRoom");
    const closeCreateRoom = document.querySelector("#closeCreateRoom");
    const findRoom = document.getElementById("findRoomBtn");
    const roomname = document.getElementById("roomIdInput")

    findRoom.addEventListener('click', () => {
        const roomName = roomname.value.trim();
        console.log(roomName)
        const rows = document.querySelectorAll('#dsroom tr');

        rows.forEach(room => {
            const roomId = room.classList[0];
            console.log(roomId)

            if (roomId != roomName) {
                room.style.display = "none";
            } else {
                room.style.display = "";
            }
        });
    });
    makeRoom.addEventListener('click', () => {
        console.log("1")
        createRoom.classList.add("show");
    });
    closeCreateRoom.addEventListener('click', () => {
        createRoom.classList.remove("show")
    })

});