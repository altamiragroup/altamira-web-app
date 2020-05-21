let headers = document.querySelectorAll('.item');

for(header of headers){
    header.addEventListener('click',function(){
        this.classList.toggle('hidden')
    })
}