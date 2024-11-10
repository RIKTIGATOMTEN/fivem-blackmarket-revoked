$(function() {
    $(document).on('click', '.store-bg .store-products .store-product .actions a', function() {
        let $action = $(this).attr('action');
        let $data = $(this).parent().parent();

        Stores[$action]({
            item: {
                item: $data.attr('item'),
                label: $data.attr('label'),
                price: parseInt($data.attr('price'))
            },

            this: this
        });
    });

    $(document).on('click', '.store-bg .store-cart .cart-list span i', function() {
        Stores.RemoveAll($(this).attr('item'))
    });

    $(document).on('click', '.store-bg .store-cart a', function() {
        if ($(this).hasClass('disabled')) { return };

        Stores.PostMessage('BuyProducts', Stores.CartList, function(response) {
            if (response) {
                $(`.store-bg .store-products .store-product .actions p[amount]`).text(`0 st`);

                Stores.CartList = [];
                Stores.UpdateCartList();
                
                M.toast({
                    html: 'Du köpte alla varor i din varukorg.'
                });
            } else {
                M.toast({
                    html: 'Du har inte tillräckligt med pengar på dig..'
                });
            }
        })
    });

    document.onkeyup = function (key) {
        if (key.which == 27) {
            Stores.CloseStore();
            return
        }
    };

    $('.modal').modal();
});