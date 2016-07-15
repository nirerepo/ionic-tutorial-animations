function ReviewController($scope, $state, $stateParams, DailyReview, $ionicNavBarDelegate, Help, $ionicHistory) {
    var self = this;
    var review1 = {
        title: "Resumen diario - Domingo, 10 de Julio",
        summary: {
            score: "1",
            needlePosition: "MID", // OK, KO, o MID
        },
        kcal: { current: 2517,
                target: 2100,
            },
        macros: {
            hc: {
                quality: "_",
                chart: {}
            },
            pt: {
                quality: "_",
                chart: {}
            },
            lp: {
                quality: "_",
                chart: {}
            }
        }
    }
    $scope.data = {
    };

    this.finalScore = function(review) {
        var kcalOK = Math.abs(review.kcal.current - review.kcal.target) < (review.kcal.target/10);
        var q = review.macros.hc.quality+review.macros.pt.quality+review.macros.lp.quality;
        console.log("KCAL-OK", kcalOK, q);
        if (kcalOK && q == '___')
            return "OK";
        else if (kcalOK || q == '__')
            return "MID";
        else return "KO";
    }

    $scope.goBack = function() {
        $ionicHistory.goBack();
    }
    $scope.scoreImage = function(score) {
        var images = ['img/others/indicators/indicator_bad.jpg', 'img/others/indicators/indicator_regular.jpg', 'img/others/indicators/indicator_good.jpg'];
        console.log('IMG:', images, score);
        return images[score];
    }
    $scope.$on("$ionicView.beforeEnter", function () {
        var reviewData = DailyReview.get($stateParams.day).then(function(body) {
            $scope.data.review = review1;
            var reviewDate = moment($stateParams.day, 'YYYYMMDD').format('MMM DD');
            $scope.data.review.title = "Resumen diario - " + reviewDate;
            $scope.data.review.kcal.current = parseInt(body.quantity);
            $scope.data.review.kcal.target = parseInt(body.targetKcal);
            $scope.data.review.macros.hc.current = parseInt(_(body.indicators).find(function(o) {
                return o.type == 'hc';
            }).quantity);
            $scope.data.review.macros.lp.current = parseInt(_(body.indicators).find(function(o) {
                return o.type == 'grasa';
            }).quantity);
            $scope.data.review.macros.pt.current = parseInt(_(body.indicators).find(function(o) {
                return o.type == 'prot';
            }).quantity);
            $scope.data.review.macros.hc.target = body.macros.hc.target;
            $scope.data.review.macros.pt.target = body.macros.pt.target;;
            $scope.data.review.macros.lp.target = body.macros.lp.target;;
            $scope.data.review.macros.hc.current = body.macros.hc.current;
            $scope.data.review.macros.pt.current = body.macros.pt.current;
            $scope.data.review.macros.lp.current = body.macros.lp.current;

            $ionicNavBarDelegate.showBackButton(true);
            $ionicNavBarDelegate.title($scope.data.review.title);
            self.buildReviewInfo($scope.data.review);
            self.setChartColors($scope.data.review.kcal);
            console.log(reviewData);
        });
    });

  var messagesGlobal = {
    KO: {
        title: '¡Tenemos bastante que mejorar!',
        messages: ['Tanto las calorías que has ingerido como el equilibrio de tu dieta pueden mejorar.', 'Veamos algunos detalles...']
    },
    MID: {
        title: '¡Todavía puedes hacerlo mejor!',
        messages: ['Teniendo en cuenta tu ingesta de calorías y tu reparto de macronutrientes, vemos que aun tenemos algo que mejorar.']
    },
    OK: {
        title: 'Lo estás haciendo muy bien!',
        messages: ['Las calorías consumidas son las adecuadas, y tu dieta tiene un equilibrio bastante razonable.']
    }

  }
  var messagesKcal = {
    kcal: ['Te faltó consumir más calorías, ¿no olvidaste introducir algún alimento?'],
    KCAL: ['Te has pasado en las calorías que deberías de tomar'],
    _: ['Las calorías que has consumido en el día son las adecuadas']
  }

  var messagesMacros = {
    hc_LP: ['Veo que que no has ingerido suficiente hidrato. Incluye los cereales como el pan, arepas, arroz y pasta. ¡Ah! y no te olvides de tomar fruta y verdura.',
        '¡Enhorabuena! Alcanzaste la cantidad de proteína recomendada.',
        '¡Cuidado con las grasas! Vigila la cantidad de aceite y evita alimentos procesados, fritos o empanizados.'
        ],

    HCptlp: ['Vigila los hidratos para no excederte. Modera la ración de cereales como arroz, pasta, pan o arepas y huye de bebidas azucaradas y dulces. ¡¡¡Alíate a las frutas y verduras!!!',
        'Te convendría tomar más proteína. Incluye carne, pescado, legumbres o huevos en tu menú.',
        'No llegaste a la cantidad recomendada de grasa. ¿Has agregado el aceite que utilizaste para cocinar o en los aderezos? Incluye alguna ración de frutos secos y/o pescado azul.'
    ],

    HC_lp: ['Veo demasiados hidratos. Deja las bebidas azucaradas y los dulces. Cambia alguna ración de cereales como arroz, pasta, pan o arepas por frutas y verduras de temporada.  ',
        '¡Enhorabuena! Has tomado la cantidad de proteína adecuada.',
        '¿Sabes? Comiste menos grasa de la recomendada. Una buena fuente es el pescado azul o los frutos secos. Recuerda agregar el aceite con que cocinas en nuestro evaluador.'],

    hcPT_: ['Sería bueno que aumentaras tus hidratos. No te olvides de la fruta y verdura, y opta por versiones integrales de cereales como pan, arepas, arroz y pasta.',
        'Veo que te pasaste con las proteínas. Reduce alimentos de origen animal sobre todo carnes rojas o procesadas.',
        '¡Enhorabuena! Tomaste la cantidad de grasa adecuada.'],

    _ptLP: ['¡Enhorabuena! Conseguiste llegar al consumo de hidratos recomendado.',
        'Para aumentar la cantidad de proteínas come alimentos de tipo legumbres, pescado o pollo.',
        '¡Cuidado con las grasas! Evita los fritos, empanizados y procesados y vigila la cantidad de aceite de tus platos.'],

    hcptLP: ['Veo que no has ingerido suficientes hidratos. ¡Auméntalos apostando por las frutas y verduras! Además, aumenta la ración de cereales de tipo pan, pasta o arroz.',
        'Aumenta las proteinas con alguna ración más de alimentos de origen animal como el pescado, conejo o pollo.',
        'Demasiada grasa...Trata de reducir el aceite y evita alimentos procesados o fritos. '],

    hcPTLP: ['Pocos hidratos. Opta por versiones integrales de cereales como pan, arepas, arroz y pasta. ¡Y no te olvides de tomar fruta y verdura!',
        'Tomaste demasiada proteína. Modera tus raciones de carne, pescado o huevo.',
        'Demasiada grasa en un día. Para mañana, vigila la cantidad de aceite que consumes y evita fritos y empanizados ;).'],

    HCPTlp: ['Veo que hay demasiado hidrato. Te vendría bien tomar frutas y verduras, optando por los de temporada. Deja los dulces y las bebidas con azúcar.',
        'Vigila la cantidad de proteínas. Reduce las raciones de alimentos como carnes rojas, huevo o cerdo.',
        'Te quedaste corto en grasas. Opta por un buen aceite para aliñar y cocinar, e introduce algún fruto seco o algún pescado azul. '],

    _PTlp: ['¡Enhorabuena! Llegaste a la cantidad de hidratos recomendada. Acuérdate de los integrales ;).',
        'Demasiada proteína para un día. Reduce la ración de alimentos de origen animal como carnes rojas, huevo o cerdo.',
        'Poca grasa. Aliña tus platos con un aceite de calidad e introduce frutos secos o pescado azul.'],
    HCptLP: ['Demasiado hidrato en un día. Toma frutas y verduras como primera opción y reduce la cantidad de cereales como arroz, pasta o arepas. Deja los dulces para ocasiones especiales y evita las bebidas con azúcar.',
        'Te vendría bien aumentar las proteínas. Incluye alguna ración más de alimentos de origen animal como pollo o pescado.',
        'Te pasaste con las grasas. Te vendría bien reducir la cantidad de aceite y evitar alimentos procesados, fritos o empanizados.'],
    ___: ['¡Enhorabuena!',
        'Tu equilibrio y balance en tu alimentación es el adecuado.',
        'Continua consumiendo las cantidades correctas de cereales, alimentos de origen animal, frutas y verduras y las grasas.']
  }

  this.buildReviewInfo = function(review) {
    var total = review.macros.hc.current + review.macros.pt.current + review.macros.lp.current;
    review.macros.hc.percentage = 100 * review.macros.hc.current / total;
    review.macros.hc.diff = review.macros.hc.current - review.macros.hc.target;
    if (review.macros.hc.percentage < 48) {
        review.macros.hc.quality = "hc";
    }
    else if (review.macros.hc.percentage > 61) {
        review.macros.hc.quality = "HC";
    }
    self.setChartColors(review.macros.hc);
    review.macros.pt.percentage = 100 * review.macros.pt.current / total;
    review.macros.pt.diff = review.macros.pt.current - review.macros.pt.target;
    if (review.macros.pt.percentage < 14) {
        review.macros.pt.quality = "pt";
    }
    else if (review.macros.pt.percentage > 21) {
        review.macros.pt.quality = "PT";
    }
    self.setChartColors(review.macros.pt);
    console.log("PT", review.macros.pt);

    review.macros.lp.percentage = 100 * review.macros.lp.current / total;
    review.macros.lp.diff = review.macros.lp.current - review.macros.lp.target;
    if (review.macros.lp.percentage < 28) {
        review.macros.lp.quality = "lp";
    }
    else if (review.macros.lp.percentage > 38) {
        review.macros.lp.quality = "LP";
    }
    self.setChartColors(review.macros.lp);

    review.macros.messages = messagesMacros[review.macros.hc.quality+review.macros.pt.quality+review.macros.lp.quality];

    review.kcal.diff = review.kcal.current - review.kcal.target;
    if (review.kcal.current > review.kcal.target*1.10) {
        review.kcal.quality = 'KCAL';
    } else if (review.kcal.current < review.kcal.target*0.9) {
        review.kcal.quality = 'kcal';
    } else {
        review.kcal.quality = '_';
    }
    review.kcal.messages = messagesKcal[review.kcal.quality];
    var score = self.finalScore(review);
    review.summary.needlePosition = score;
    review.summary.title = messagesGlobal[score].title;
    review.summary.messages = messagesGlobal[score].messages;
    console.log(review.summary.score);
  }

  this.setChartColors = function(macro) {
    var OK_COLOR="#7AB800";
    var NO_COLOR="#ECF0F1";
    var KO_COLOR="#E74C3C";

    if (!macro.chart) macro.chart = {};

    if (macro.current > macro.target) {
        macro.chart.bg = OK_COLOR;
        macro.chart.fg = KO_COLOR;
        macro.chart.current = macro.current - macro.target;
        macro.chart.max = macro.target;
    }
    if (macro.current < macro.target) {
        macro.chart.bg = NO_COLOR;
        macro.chart.fg = OK_COLOR;
        macro.chart.current = macro.current;
        macro.chart.max = macro.target;
    }
    if (macro.current == macro.target) {
        macro.chart.bg = NO_COLOR;
        macro.chart.fg = OK_COLOR;
        macro.chart.current = macro.current;
        macro.chart.max = macro.target;
    }
  }
}

angular.module('nire.controllers')
    .controller('ReviewCtrl', ReviewController)
