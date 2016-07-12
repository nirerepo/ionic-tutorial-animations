function ReviewController($scope, $state, $stateParams, $ionicNavBarDelegate, Help) {
    var self = this;
  var review1 = {
    title: "Resumen diario - Domingo, 10 de Julio",
    kcal: { current: 2817,
            target: 2100,
        },
    macros: {
        hc: {
            target: 210,
            current: 73,
            quality: ""
        },
        pt: {
            target: 94,
            current: 41,
            quality: ""
        },
        lp: {
            target: 70,
            current: 64,
            quality: ""
        }
    }
  }
  var messages = {
    hcLP: ['Veo que que no has ingerido suficiente hidrato. Incluye los cereales como el pan, arepas, arroz y pasta. ¡Ah! y no te olvides de tomar fruta y verdura.',
        '¡Enhorabuena! Alcanzaste la cantidad de proteína recomendada.',
        '¡Cuidado con las grasas! Vigila la cantidad de aceite y evita alimentos procesados, fritos o empanizados.'
        ],

    HCptlp: ['Vigila los hidratos para no excederte. Modera la ración de cereales como arroz, pasta, pan o arepas y huye de bebidas azucaradas y dulces. ¡¡¡Alíate a las frutas y verduras!!!',
        'Te convendría tomar más proteína. Incluye carne, pescado, legumbres o huevos en tu menú.',
        'No llegaste a la cantidad recomendada de grasa. ¿Has agregado el aceite que utilizaste para cocinar o en los aderezos? Incluye alguna ración de frutos secos y/o pescado azul.'
    ],

    HClp: ['Veo demasiados hidratos. Deja las bebidas azucaradas y los dulces. Cambia alguna ración de cereales como arroz, pasta, pan o arepas por frutas y verduras de temporada.  ',
        '¡Enhorabuena! Has tomado la cantidad de proteína adecuada.',
        '¿Sabes? Comiste menos grasa de la recomendada. Una buena fuente es el pescado azul o los frutos secos. Recuerda agregar el aceite con que cocinas en nuestro evaluador.'],

    hcPT: ['Sería bueno que aumentaras tus hidratos. No te olvides de la fruta y verdura, y opta por versiones integrales de cereales como pan, arepas, arroz y pasta.',
        'Veo que te pasaste con las proteínas. Reduce alimentos de origen animal sobre todo carnes rojas o procesadas.',
        '¡Enhorabuena! Tomaste la cantidad de grasa adecuada.'],

    ptLP: ['¡Enhorabuena! Conseguiste llegar al consumo de hidratos recomendado.',
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

    PTlp: ['¡Enhorabuena! Llegaste a la cantidad de hidratos recomendada. Acuérdate de los integrales ;).',
        'Demasiada proteína para un día. Reduce la ración de alimentos de origen animal como carnes rojas, huevo o cerdo.',
        'Poca grasa. Aliña tus platos con un aceite de calidad e introduce frutos secos o pescado azul.'],
    HCptLP: ['Demasiado hidrato en un día. Toma frutas y verduras como primera opción y reduce la cantidad de cereales como arroz, pasta o arepas. Deja los dulces para ocasiones especiales y evita las bebidas con azúcar.',
        'Te vendría bien aumentar las proteínas. Incluye alguna ración más de alimentos de origen animal como pollo o pescado.',
        'Te pasaste con las grasas. Te vendría bien reducir la cantidad de aceite y evitar alimentos procesados, fritos o empanizados.']

  }

  $scope.data = {
    review: review1
  };

  $scope.data.bgColors = [];
  $scope.data.currentPage = $stateParams.startpage;
  console.log("Current: ", $scope.data);
  Help.loadPages($scope, $ionicNavBarDelegate);
  $ionicNavBarDelegate.showBackButton(true);

  $ionicNavBarDelegate.title($scope.data.review.title);


  this.updateDistribution = function(macros) {
    var total = macros.hc.current + macros.pt.current + macros.lp.current;
    macros.hc.percentage = 100 * macros.hc.current / total;
    if (macros.hc.percentage < 48)
        macros.hc.quality = "hc";
    else if (macros.hc.percentage > 61)
        macros.hc.quality = "HC";
    
    macros.pt.percentage = 100 * macros.pt.current / total;
    if (macros.pt.percentage < 14)
        macros.pt.quality = "pt";
    else if (macros.pt.percentage > 21)
        macros.pt.quality = "PT";

    macros.lp.percentage = 100 * macros.lp.current / total;
    if (macros.lp.percentage < 28)
        macros.lp.quality = "lp";
    else if (macros.lp.percentage > 38)
        macros.lp.quality = "LP";

    macros.messages = messages[macros.hc.quality+macros.pt.quality+macros.lp.quality];
    console.log("DISTRIB: ", macros.hc.quality+macros.pt.quality+macros.lp.quality);
  }

  self.updateDistribution($scope.data.review.macros);

}

angular.module('nire.controllers')
    .controller('ReviewCtrl', ReviewController)
