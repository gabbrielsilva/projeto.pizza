let cart = []
let modalQT = 1;
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem das pizzas
pizzaJson.map(function(item, index){
    let = pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Colocando os itens na tela.

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    // Modal    
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();  // adicionar o clic no a e cancelar o evento de click do a.
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // Pegar a key da pizza 
        modalQT = 1;
        modalKey = key; // saber qual pizza é no modal

        c('.pizzaInfo h1').innerHTML = item.name;
        c('.pizzaInfo--desc').innerHTML = item.description;
        c('.pizzaInfo--actualPrice').innerHTML = item.price;
        c('.pizzaBig img').src = item.img
        c('.pizzaInfo--size.selected').classList.remove('selected')
        // pegar os tamanhos da pizza
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            // Sempre deixar selecionado a pizza grande
            if(sizeIndex == 2){
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        c('.pizzaInfo--qt').innerHTML = modalQT

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;  // Criar um delay na hora de abrir, para não abrir seco.
        }, 200)
       
    })

    c('.pizza-area').append( pizzaItem )
})
// Eventos do modal
function CloseModal(){
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
}

cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item)=>{
    item.addEventListener('click', CloseModal)
})
// diminuir a quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQT > 1){
        modalQT--;
        c('.pizzaInfo--qt').innerHTML = modalQT;
    }
})

// aumentar a quantidade
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQT++;
    c('.pizzaInfo--qt').innerHTML = modalQT;

})

// Selecionado os tamanhos
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
   })
})

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));


    let identificador = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>{
        return item.identificador == identificador;
    })
    // verificação para as pizzas ficarem juntas
    if(key > -1){
        cart[key].qt += modalQT;
    } else{
        cart.push({
            identificador,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQT
        });
    }

    CloseModal();
    updatecarro();

    c('.menu-openner span').addEventListener('click', () => {
        if(cart.length > 0){
            c('aside').style.left = '0'
        }
    })
    c('.menu-closer').addEventListener('click', () =>{
        c('aside').style.left = '100vw'
    })
});

// Função para abrir o carrrinho
function updatecarro() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = '' // zerar a listagem

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            //for para retornar os itens da pizza
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){   
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;


            cartItem.querySelector('img').src= pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                updatecarro()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updatecarro();
            })

            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


            c('.cart').append(cartItem);

        }
    } else{
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}

