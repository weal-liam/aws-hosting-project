const socket = io();


socket.on('chat message',(msg)=>{
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight);
})