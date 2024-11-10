ESX = {}

TriggerEvent('esx:getSharedObject', function(library) 
	ESX = library 
end)

ESX.RegisterServerCallback('rxbin_blackmarket:BuyProducts', function(source, cb, cartList)
	local player = ESX.GetPlayerFromId(source);
	local TotallyPrice = 0;

	for i = 1, #cartList do
		TotallyPrice = TotallyPrice + cartList[i].price;
	end

	if player.getMoney() >= TotallyPrice then
		cb(true)

		player.removeMoney(TotallyPrice);
		
		for i = 1, #cartList do
			if cartList[i].item == "cigarettepack" then
				player.addInventoryItem(cartList[i].item, cartList[i].amount, {
					["description"] = "Winston Blue är en lättare variant av Winstons cigaretter. Det finns 20st cigaretter i detta paket.",
					["cigarettesLeft"] = 20
				})
			elseif cartList[i].item == "notebook" then
				player.addInventoryItem(cartList[i].item, cartList[i].amount, {
					["label"] = "Anteckningsblock",
					["description"] = "Anteckningsblocket har 30 sidor kvar.",
					["pagesLeft"] = 30,
					["pages"] = {}
				})
			elseif cartList[i].item == "snus" then
				player.addInventoryItem(cartList[i].item, cartList[i].amount, {
					["description"] = "Det finns 25st snuspåsar i dosan.",
					["snusLeft"] = 25,
				})
			elseif cartList[i].item == "powerbank" then
				player.addInventoryItem(cartList[i].item, cartList[i].amount, {
					["percent"] = 100,
					["description"] = "Powerbanken har 100% batteri kvar."
				})
			else
				player.addInventoryItem(cartList[i].item, cartList[i].amount)
			end
		end
	else
		cb(false)
	end
end)