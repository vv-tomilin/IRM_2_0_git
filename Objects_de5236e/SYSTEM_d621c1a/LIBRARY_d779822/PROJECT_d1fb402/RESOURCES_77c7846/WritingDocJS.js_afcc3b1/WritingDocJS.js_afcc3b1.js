async function sendToServ(formocka){
console.log(formocka)

try{   let response = await fetch('https://ir-backend.rigintelpro.ru/api/v1/file_service/uploadfile/', {
	 
      method: 'POST',
      body: new FormData(formocka)
    })
    console.log(FormData(formocka))
let result = await response.formData();  
alert(result.message);  
    }catch(error){
console.log('',error)    
    }
	
    


  };
//new FormData(formocka)
