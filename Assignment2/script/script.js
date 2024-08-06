let objectData={};


async function handleSubmit(event){
    event.preventDefault()
    console.log(objectData);
    
    await fetch('https://jsonplaceholder.typicode.com/posts',{
        method:"POST",
        headers:{
            "content-type":"Application/json"
        },
        body:JSON.stringify({
            firstName:objectData.results[0].name.first,
            lastName:objectData.results[0].name.last,
            email:objectData.results[0].email,
            password:objectData.results[0].password,
            gender:objectData.results[0].gender,
            Hobbies:["music","sports"],
            Picture:objectData.results[0].picture.large,
            Bio:"hi iam interested in playing sports and music this is about me"
        })
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        alert('data saved succesfully')
    })
    .catch(e=>{
        console.log(error)
        alert('data not saved')
    })
}


async function start(){
    
    await fetch("https://randomuser.me/api/")
    .then(res=>res.json())
    .then(data=>objectData=data)
    document.querySelector('#first-name').value=objectData.results[0].name.first
    document.querySelector('#second-name').value=objectData.results[0].name.last
    document.querySelector('#Email').value=objectData.results[0].email
    document.querySelector('#Password').value=objectData.results[0].password
    document.querySelector('#confirm-password').value=objectData.results[0].password
    let gender=objectData.results[0].gender
    var radios=document.getElementsByName('gender')
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value === gender) {
            radios[i].checked = true; // Set the radio button as selected
            break; // Exit loop once the correct button is found
        }
    }
    const hobbies1="music";
    const hobbies2="sports";
    const hobbiearray=document.getElementsByName('Hobbies')
    for (var i = 0; i < hobbiearray.length; i++) {
        if (hobbiearray[i].value === hobbies1 ||hobbiearray[i].value === hobbies2 ) {
            hobbiearray[i].checked = true; // Set the radio button as selected// Exit loop once the correct button is found
        }
    }
    document.getElementsByName("picture").value=objectData.results[0].picture.large
    document.querySelector('#age').value=objectData.results[0].dob.age
    document.querySelector('#bio').value="hi iam interested in playing sports and music this is about me"
}

start()