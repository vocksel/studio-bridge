-- Radio Button
-- Crazyman32
-- December 20, 2015

--[[

	radioButton = RadioButton.new(button, currentState)

	radioButton.State
	radioButton.Button

	radioButton:SetState(newState)
	radioButton:ToggleState()

	radioButton.StateChanged.Event(newState)

--]]



local RadioButton = {}
RadioButton.__index = RadioButton


function RadioButton.new(button, state)
  print(button:GetFullName(), state)
	local stateChanged = Instance.new("BindableEvent")

	local radioButton = setmetatable({
		State = nil;
		Button = button;
		StateChanged = stateChanged;
	}, RadioButton)

	radioButton:SetState(state)

	button.MouseButton1Click:connect(function()
		radioButton:ToggleState()
	end)

	return radioButton

end


function RadioButton:SetState(state)
	state = (not not state)
	if (state ~= self.State) then
		self.State = state
		self.Button.Text = (state and "O" or "")
		self.StateChanged:Fire(state)
	end
end


function RadioButton:ToggleState()
	self:SetState(not self.State)
end


return RadioButton
