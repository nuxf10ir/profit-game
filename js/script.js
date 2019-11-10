_.templateSettings = {
    evaluate: /\{\[([\s\S]+?)\]\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g
};

jQuery.fn.cardGame = function(data) {
    var $self = $(this),
        questionsData = gameData.questionsData,
        answersData = gameData.answersData,
        $card = $("#card", $self),
        $front = $("#card-front", $card),
        $back = $("#card-back", $card),
        questionTmpl = _.template($("#question__tmpl").html()),
        answerTmpl = _.template($("#answer__tmpl").html()),
        resultTmpl = _.template($("#result__tmpl").html()),
        _balance = 100,
        _profit = 0;

    function updateResult(answer) {
        _balance += answer.balance;
        _profit += answer.profit;
    }

    function resetResult() {
        _balance = 100;
        _profit = 0;
    }

    function getResult() {
        return {
            balance: _balance,
            profit: _profit
        }
    }

    $card.flip({
        trigger: 'manual',
        axis: 'y'
    });

    $card.on("click.cardGame", ".js-to-question", function(e) {
        var $this = $(e.currentTarget),
            questionId = $this.data("question");

        if (_balance <= 0) {
            $front.html(resultTmpl({
                type: 'low',
                buttonText: 'Начать сначала',
                text: 'Упс, деньги закончились.<br/>Попробуйте начать сначала )))'
            }));

            resetResult();

        } else  if (questionId === 'result') {
            var data = {
                type:  'medium',
                buttonText: 'Попробовать еще раз',
                text: 'Неплохо! Компания не&nbsp;достигла плановой прибыли, но&nbsp;Вы смогли не&nbsp;допустить банкротства, и&nbsp;сохранить деньги на&nbsp;счетах! Попробуйте еще раз, если хотите достичь амбициозных целей собственника!'
            };

            if (_profit >= 7) {
                data = {
                    type:  'high',
                    buttonText: 'Попробовать еще раз',
                    text: 'Браво! Вы&nbsp;блестяще справились!<br/>Бизнес процветает, и&nbsp;все это благодаря Вам!'
                };
            }

            resetResult();

            $front.html(resultTmpl(data));
        } else {
            $front.html(questionTmpl(_.extend(questionsData[questionId], {id: questionId}, getResult())));
        }
        $card.flip(false);


    });

    $card.on("click.cardGame", ".js-to-answer", function(e) {
        var $this = $(e.currentTarget),
            questionId = $this.data("question"),
            answerId = $this.data("answer"),
            answerData = answersData[questionId][answerId];

        updateResult(answerData.calc);

        $back.html(answerTmpl(_.extend({}, answerData, getResult())));
        $card.flip(true);
    });


    return {
        init: function () {
            setTimeout(function () {
                $card.flip(true);
            }, 1000);
        }

    }


};


$("#cardgame").cardGame(gameData).init();






