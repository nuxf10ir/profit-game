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
        _balance = 50,
        _profit = 0;

    function updateResult(answer) {
        _balance += answer.balance;
        _profit += answer.profit;
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

        $front.html(questionTmpl(_.extend(questionsData[questionId], {id: questionId}, getResult())));
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






