Stores = {};

Stores.EventHandler = function(event) {
    var data = event.data;
    Stores[data.event] && Stores[data.event](data.data || {})
};

Stores.OpenStore = function(data) {
    $(`.store-bg .store-products`).html(``);
    $(`.container`).show();

    Stores.CartList = [];

    var i;
    for (i = 0; i < data.products.length; i++) {
        $(`.store-bg .store-products`).append(`
        <div class="store-product" item=${data.products[i].item} price=${data.products[i].price} label=${data.products[i].label}>
            <div class="image-bg">
                <img src="${data.products[i].image || ''}">
            </div>
            <p label>${data.products[i].label}</p>
            <p price>${data.products[i].price} kr</p>
        
            <div class="actions">
                <a class="btn-floating btn waves-effect waves-light red remove" action="RemoveProduct"><i class="material-icons">remove</i></a>
                <p amount>0 st</p>
                <a class="btn-floating btn waves-effect waves-light green add" action="AddProduct"><i class="material-icons">add</i></a>
            </div>
        </div>`)
    }

    Stores.UpdateCartList()
};

Stores.CloseStore = function(data) {
    $(`.container`).hide();
    Stores.PostMessage('close')
};

Stores.AddProduct = function(data) {
    var PushElement = true;
    var i;
    for (i = 0; i < Stores.CartList.length; i++) {
        if (Stores.CartList[i].item == data.item.item) {
            Stores.CartList[i].amount = Stores.CartList[i].amount + 1;
            Stores.CartList[i].price = Stores.CartList[i].price + data.item.price;

            $(data.this).parent().find('p[amount]').text(`${Stores.CartList[i].amount} st`);

            PushElement = false;
            break
        }
    }

    if (PushElement) { 
        data.item.amount = 1;
        Stores.CartList.push(data.item) 

        $(data.this).parent().find('p[amount]').text(`${data.item.amount} st`);
    }

    M.toast({
        html: `Du lade i 1st ${data.item.label} i din varukorg.`
    })

    Stores.UpdateCartList()
};

Stores.RemoveProduct = function(data) {
    var i;
    for (i = 0; i < Stores.CartList.length; i++) {
        if (Stores.CartList[i].item == data.item.item) {
            Stores.CartList[i].amount = Stores.CartList[i].amount - 1;
            Stores.CartList[i].price = Stores.CartList[i].price - data.item.price;

            if (Stores.CartList[i].amount < 1) {
                $(data.this).parent().find('p[amount]').text(`0 st`);
                Stores.CartList.splice(i, 1)
            } else {
                $(data.this).parent().find('p[amount]').text(`${Stores.CartList[i].amount} st`);
            };

            break
        }
    }

    M.toast({
        html: `Du raderade 1st ${data.item.label} i din varukorg.`
    })

    Stores.UpdateCartList()
};

Stores.RemoveAll = function(item) {
    var $amount;
    var $label;
    var i;
    for (i = 0; i < Stores.CartList.length; i++) {
        if (Stores.CartList[i].item == item) {
            $label = Stores.CartList[i].label;
            $amount = Stores.CartList[i].amount;

            $(`.store-bg .store-products .store-product[item=${item}] .actions p[amount]`).text(`0 st`);
            Stores.CartList.splice(i, 1);
            break
        }
    }

    M.toast({
        html: `Du raderade ${$amount}st ${$label} i din varukorg.`
    });

    Stores.UpdateCartList();
};

Stores.UpdateCartList = function() {
    $(`.store-bg .store-cart .cart-list`).html('');

    var i;
    for (i = 0; i < Stores.CartList.length; i++) {
        $(`.store-bg .store-cart .cart-list`).append(`${Stores.CartList[i].amount} ${Stores.CartList[i].label} - ${Stores.CartList[i].price} kr<span><i item=${Stores.CartList[i].item} class="material-icons">delete_forever</i></span><br>`)
    }

    if (Stores.CartList.length < 1) {
        $(`.store-bg .store-cart a`).addClass('disabled')
    } else {
        $(`.store-bg .store-cart a`).removeClass('disabled')
    }
}

window.addEventListener('message', Stores.EventHandler);

Stores.PostMessage = function(event, data, cb) {
    fetch(`https://rxz_blackmarket/EventHandler`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            event: event,
            data: data || {}
        })
    })
    .then(resp => 
        resp.json()
    )
    .then(resp => 
        cb(resp)
    );
};