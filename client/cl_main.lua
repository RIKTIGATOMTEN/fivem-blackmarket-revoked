Stores = {}
ESX = {}

TriggerEvent('esx:getSharedObject', function(library) 
	ESX = library 
end)

RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function(d)
	TriggerEvent('esx:getSharedObject', function(library) 
		ESX = library 
	end)

	ESX.PlayerData = d
end)

RegisterNetEvent('esx:setJob')
AddEventHandler('esx:setJob', function(job)
	ESX.PlayerData['job'] = job
end)

Citizen.CreateThread(function()
	while true do
		local player, sleepThread = PlayerPedId(), 750;

		for i = 1, #Config.Stores do
			local dst = #(GetEntityCoords(player) - Config.Stores[i]);

			if dst < 1.0 and exports["dillen_semiwhitelist"]:HasKrim() then
				Stores.Draw3DText(Config.Stores[i], '[~p~E~w~] Öppna blackmarket');
				sleepThread = 5;

				if dst < 1.0 then
					if IsControlJustReleased(0, 38) then
						Stores.OpenStore()
					end
				end
			end
		end

		Citizen.Wait(sleepThread)
	end
end)

local kordinater2 = {
    {514.6634, 3097.2139, 39.4934,"Magdalena",172.34,0x41018151,"a_f_m_ktown_02"}
}

Citizen.CreateThread(function()

    for _,v in pairs(kordinater2) do
      RequestModel(GetHashKey(v[7]))
      while not HasModelLoaded(GetHashKey(v[7])) do
        Wait(1)
      end
  
      RequestAnimDict("mini@strip_club@idles@bouncer@base")
      while not HasAnimDictLoaded("mini@strip_club@idles@bouncer@base") do
        Wait(1)
      end
      ped =  CreatePed(4, v[6],v[1],v[2],v[3], 3374176, false, true)
      SetEntityHeading(ped, v[5])
      FreezeEntityPosition(ped, true)
      SetEntityInvincible(ped, true)
      SetBlockingOfNonTemporaryEvents(ped, true)
      TaskPlayAnim(ped,"mini@strip_club@idles@bouncer@base","base", 8.0, 0.0, -1, 1, 0, 0, 0, 0)
    end
end)

Citizen.CreateThread(function()
    while true do
        local pos = GetEntityCoords(GetPlayerPed(-1), true)
        Citizen.Wait(0)
        for _,v in pairs(kordinater2) do
            x = v[1]
            y = v[2]
            z = v[3]
            if(Vdist(pos.x, pos.y, pos.z, x, y, z) < 20.0)then
                DrawText3D(x,y,z+2.10, "~w~"..v[4], 1.2, 1)
                DrawText3D(x,y,z+1.95, "~w~", 1.0, 1)
            end
        end
    end
end)


function DrawText3D(x,y,z, text, scl, font) 

    local onScreen,_x,_y=World3dToScreen2d(x,y,z)
    local px,py,pz=table.unpack(GetGameplayCamCoords())
    local dist = GetDistanceBetweenCoords(px,py,pz, x,y,z, 1)
 
    local scale = (1/dist)*scl
    local fov = (1/GetGameplayCamFov())*100
    local scale = scale*fov
   
    if onScreen then
        SetTextScale(0.0*scale, 1.1*scale)
        SetTextFont(font)
        SetTextProportional(1)
        SetTextColour(255, 255, 255, 255)
        SetTextDropshadow(0, 0, 0, 0, 255)
        SetTextEdge(2, 0, 0, 0, 150)
        SetTextDropShadow()
        SetTextOutline()
        SetTextEntry("STRING")
        SetTextCentre(1)
        AddTextComponentString(text)
        DrawText(_x,_y)
    end
end