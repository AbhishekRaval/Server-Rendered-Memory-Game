defmodule Memory.Game do
	
	def game_vars do
		%{height: 4, width: 4, str: "AABBCCDDEEFFGGHH"}
	end

	def game_state do
		%{wfc: "Waiting_First_Card" ,wsc: "Waiting_Second_Card"}
	end

	def new do
		%{
			cards: init_card(),
			gameState: game_state().wfc,
			firstcard: nil,
			count: 0,
			score: 0,
			percent: 0,
			height: game_vars().height,
			width: game_vars().width,
			str: game_vars().str,
			secondcard: 0
		}
	end

	def init_card do
		str = game_vars().str;
		stringList = String.graphemes(str)
		card = Enum.map(stringList,fn(x) -> 
			%{cardValue: x,flipped: false,colstate: 0} end)
		Enum.shuffle(card)
	end


	def handleclickfn(game,i,j) do
		card = game.cards
		curri = i*game.width + j
		currcard = Enum.at(game.cards,curri)
		currcardval = currcard.cardValue

		if(!currcard.flipped && game.secondcard === 0) do
			cond do
				game.gameState === game_state().wfc  ->
					currcard = Map.replace!(currcard, :flipped, true)
					currcard = Map.replace!(currcard, :colstate, 0)
					card_Send = List.replace_at(card, curri, currcard)
					countUp = game.count + 1
					fc = %{ :iIndex => i, :jIndex => j}
					%{cards: card_Send,
					score: game.score,
					height: game_vars().height,
					width: game_vars().width,
					str: game_vars().str,
					firstcard: fc,
					count: countUp,
					percent: game.percent,
					gameState: game_state().wsc,
					secondcard: 0}

				game.gameState === game_state().wsc ->		
					card = game.cards

					#storing values of firstcard in local variable
					firstcardIndex = game.firstcard.iIndex*game.width+game.firstcard.jIndex
					firstcardtemp = Enum.at(card,firstcardIndex)	
					firstCardVal = firstcardtemp.cardValue

					#flipping second card
					currcard = Map.replace!(currcard, :flipped, true)
					card_Send = List.replace_at(card, curri, currcard)

					if firstCardVal === currcardval do 

						#set both colstate to 1
					firstcardtemp1 = Map.replace!(firstcardtemp, :colstate, 1)
					currcard = Map.replace!(currcard, :colstate, 1)

					card_Send = List.replace_at(card,firstcardIndex,firstcardtemp1)		
					card_Send2 = List.replace_at(card_Send,curri, currcard)

					#getting Percentage

					percCount = length(Enum.filter(card_Send2,fn(x)->x.flipped end))

					percentage = (percCount/(game.height*game.width))*100



					countUp = game.count + 1
					currscore = game.score + 25 + game.count

					%{cards: card_Send2,
					score: currscore,
					height: game_vars().height,
					width: game_vars().width,
					str: game_vars().str,
					firstcard: nil,
					count: countUp,
					percent: percentage,
					gameState: game_state().wfc,
					secondcard: 0}

					else

					firstcardtemp1 = Map.replace!(firstcardtemp, :colstate, 0)
					firstcardtemp2 = Map.replace!(firstcardtemp1, :flipped, false)
					card_Send = List.replace_at(card, firstcardIndex,firstcardtemp2)

					currcard1 = Map.replace!(currcard, :flipped, false)	
					currcard2 = Map.replace!(currcard1, :colstate, 0)	
					countUp = game.count + 1
					currscore = game.score  - 5 - game.count

					card_Send2 = List.replace_at(card_Send, curri, currcard2)

					%{cards: card_Send2,
					score: currscore,
					height: game_vars().height,
					width: game_vars().width,
					str: game_vars().str,
					firstcard: nil,
					count: countUp,
					percent: game.percent,
					gameState: game_state().wfc,
					secondcard: game.secondcard}	
					end
				end
			else
				%{cards: game.cards,
				score: game.score,
				height: game_vars().height,
				width: game_vars().width,
				str: game_vars().str,
				firstcard: game.firstcard,
				count: 5,
				percent: game.percent,
				gameState: game.gameState,
				secondcard: game.secondcard}				
			end

			end

			def client_view(game) do
				%{
					cards: game.cards,
					score: game.score,
					height: game_vars().height,
					width: game_vars().width,
					str: game_vars().str,
					firstcard: game.firstcard,
					count: game.count,
					percent: game.percent,
					gameState: game.gameState,
					secondcard: game.secondcard
				}

			end
		end