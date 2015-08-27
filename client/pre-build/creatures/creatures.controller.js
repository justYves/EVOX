app.controller('CreaturesController', function($scope, $state, CreatureFactory, user, shapes) {
    $scope.mySlides = user.creature;

    function findMatch(arr, name) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name === name) return {
                _id: arr[i]._id,
                hash: arr[i].hash
            }
        };
    }

    $scope.slides = [{
        name: 'beaver',
        vision: 3,
        category: 'small',
        size: 3,
        shape: findMatch(shapes, 'beaver')
    }, {
        name: 'chick',
        vision: 1,
        category: 'small',
        size: 1,
        shape: findMatch(shapes, 'chick')
    }, {
        name: 'crocodile',
        vision: 5,
        category: 'medium',
        size: 4,
        shape: findMatch(shapes, 'crocodile')
    }, {
        name: 'deer',
        vision: 4,
        category: 'medium',
        size: 7,
        shape: findMatch(shapes, 'deer')
    }, {
        name: 'duck',
        vision: 1,
        category: 'small',
        size: 2,
        shape: findMatch(shapes, 'duck')
    }, {
        name: 'elephant',
        vision: 4,
        category: 'large',
        size: 8,
        shape: findMatch(shapes, 'elephant')
    }, {
        name: 'fox',
        vision: 5,
        category: 'medium',
        size: 3,
        shape: findMatch(shapes, 'fox')
    }, {
        name: 'lion',
        vision: 6,
        category: 'large',
        size: 5,
        shape: findMatch(shapes, 'lion')
    }, {
        name: 'penguin',
        vision: 2,
        category: 'small',
        size: 2,
        shape: findMatch(shapes, 'penguin')
    }, {
        name: 'pigeon',
        vision: 1,
        category: 'small',
        size: 2,
        shape: findMatch(shapes, 'pigeon')
    }, {
        name: 'turtle',
        vision: 10,
        category: 'small',
        size: 4,
        shape: findMatch(shapes, 'turtle')
    }, {
        name: 'wolf',
        vision: 6,
        category: 'medium',
        size: 6,
        shape: findMatch(shapes, 'wolf')
    }];

    // $scope.slides = [{
    //     name: 'beaver',
    //     vision: 3,
    //     category: 'small',
    //     size: 3,
    //     shape: {
    //         hash: '#C/2ecc713498db5e2f0c261506ecf0f18e9091:A/bkmjaffYhafhVhfSfYhShUhSfafhSfehhhShaffShahhYfchhVhidffeVhhdfffYfYfcihZfhZfhdkheYfYfYfYffhehjYiZfedhfiYeYhVfffiieeUhUhYcUfUfeifhYfYfSffhdehYfahhYffhhffYfShYhUhYfSfYhefhhYhcjjSfSfSfSfSfaclSfSfSfSfSfajmSfQSfQSfQSfQSfQSfQSfQafnQSfafhafZahmahfYfahfYfahfYfahfYfahfYfahfYfahfYfajhaffYdahfajheedoSfaifSfSfSfSfackSfSfSfSfekilSfSfSfSfSfUfSfUhSfUfWfhSfecinSfSfSfSfSfSfSfekfnSfSfSfacjSfSfSfSfSfSfSfWfhSffkdhhSfafhSfYdShfjjlfSfSfSfSfSfYfahfSfaenSfSfSfSfSfSfSfahhdfdhShfhjlfSfSfSfSfSdeieiYfahfYfchhYfeefhUhcffUhWffYhUhYfekijefeeYhWheYcUhUhUhYiYhYhUfUfYfYfYfcihYfYfbifhYfYfaifYfYfaifYfYfaifYfYfbksfYabkThYfYfeifkYfYfSfYhYhaffYfYiSfYfSfafhSfYi'
    //     }
    // }, {
    //     name: 'chick',
    //     vision: 1,
    //     category: 'small',
    //     size: 1,
    //     shape: {
    //         hash: '#C/2ecc713498db34495ee67e22ecf0f1d92323000000:A/fhkbkSfYhYhYhYhYbShYlShShShShWhbUhUhUhUhUhUhUhUhUhUhcbWYhcfhUhUhUhUhUhUhUhUhUhYhYhYhYhceWYhYhehqhShShebVfShShafcahlYfSfSfSfSfemrkSfWedShShShShWfcWihShSeaffYfchfYeZhidhZeYfYfYfcefUhUhUhUhUhUhUhUhUhUhclYYfYfYfcjhYfYfYfcjhYfYfYfcjhYfYfYfcjhYfYfYfcjhYfYfYfUhUhYhejejedYeYhfhcjfSiafeYfYfYfahhYfShYiYfYiaffcfhUhUhVhhYhYhfjoefYhbefhWffShShShShWhfShcfYScShShShafeYfYfaihYfYfaihYfYffjcefYcYhYhYhaheYfYfYfYfShYhYhcfhUhUhfehlhYhYhYhYhYhYhWhbShShShShShWhbShShShShShWhbShShShShShWhbShShShShShWhbShShShShShWhbShShShShShUhUhUhWheShShUhcfeZfidhYeYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfcjhYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfalbYfYfYfYfYfalhYfYfYfYfakhShaffYfYfYfYfakhYfYfYfYfakhYfYfYfYfSdfkhhhfhfiffehehYfYjcfhYedlaeYhdffifYadfShShShShShShafaShShShShShShehhaYfahmYfehhaYfahmYfamZUhcffUhYfUfcfhUfcfhUfekhfUfcfhUfcfhUfcfhUfcfhUfefhiYfahmYfehhaYfahmYfahfSfSfSfafjSfSfSfSfYhYeShShShShWccShShShShWhcUhUhWekUhUhWedShShUhSfSfWhiSfSfejijUhUhUhUhUhWbfUhUhUhUhUhWbfUhUhUhUhUhWbfUhUhUhUhUhWbfUhUhUhUhUhekZmUfcfhUfcfhUfcfhUfcfhUfekhhUfcfhUfcfhUfcfhUfcfhUf'
    //     }
    // }, {
    //     name: 'crocodile',
    //     vision: 5,
    //     category: 'medium',
    //     size: 4,
    //     shape: {
    //         hash: '#C/2ecc713498db000000e67e22ecf0f14dbd3a010f01148c2e:A/bfmlShShShYhYhYhSeShSeSffehkfYhYhSfSfSfadiSfSfSjdhhhYhYhSfSfSfWeeSfWjmcdfSfSeWefSfSfSfYjediiSeajjSfSfSfXfjfSfSfSfadjSfSfSffifmhSfSfSfSfSfSfafmSfSfSfUhWffSfSfehimYfaheYfaheYfaheYfaifYfYeYhcihYecieUfYfYeYhcfhYhYhchjYfYeYheecoQSfSfSfSfSfSfSfSfXhofQSfSfSfSfSfSfSfXhnhQSfSfSfSfSfSfSfSfUfWioSYUhdjfhYefjdffYfYfYfYfUhYhYhYhYhUhYfYfYeYhcfhYhYhYhYhUhYfYeYfYiejcfYfYfYfYfahfYfchhYfeffhUhYfekffQYhYhWhhYfYfadfYjYhYhWfTYfYfYfYfYfYfamsSeSfUhWffSfSfSfSfSfSfSfSqUhShSeehfkSfahhSfYXShaifcfheefhSfaidSkSfSfSdSiSdSfSfSfSfSfSfSfaffShaffShapfShYhSfeYhsSfSfSfSfSfSfSfSfSfSfSfSfYhYhYhYhYhYhSoSfSfSfSfSfSfSfedfnQUhWfhYhahhShYfYfchhWfhYfWhfeffhSeaffShShShWhfWfdUhSiYhWfeafdShShUhWfdahhWhjWfeWhfSieiffSkWheWffUhSeehfkSfSfSfWhheffeWhfeffiShSeWhiSecifUhWffUhSeeefiYfUhWffYhWhfeefhSfUhchfejhpaffYfefffSieihXeeffcjhcefYeWhjeifbYhYeaheSfSeSfSeafmSfSeSfSeaimSfSeSfSeaefYhYhaefYhYheeh2SjajcSeacdaifafeaffaiteifedchiYhYhYhYhacdYhYhYhYhacdYhYhYhYhacdYhYhdhfeYhdfhiYhedhzYhYhaeeYhYhaeeYhYhelecSfaUhSfasUSfYUShYndeheYhYhfffdiYhYeaidYfYfaidYeYh'
    //     }
    // }, {
    //     name: 'deer',
    //     vision: 4,
    //     category: 'medium',
    //     size: 7,
    //     shape: {
    //         hash: '#C/2ecc713498db34495ee67e22cfd1d10000008c4e15eddb9d570a0a:A/bkjoVhfUhVhfUhYfUhUhYfYfUhYhYhcehYhYhfeefhUhchfUhYhUfYhUhYhUhYhUhYhUhUhUhddcfchhchhUhUhdhhhUhdfffVhhfdbhfYfYfekhfUhUhUhUhUhYhYhYhSfSfbhihSfSfffhifSfSfWhiYfcffUhdjfhSfSffhfihSfWhfUfWhhShfehfeSfafhYfahfYfdhhhUhSfWfjUhShSbSmShSYYfYfYfaioYfYfUhUhUhWeYUhUhahoYhafYYhcfhUhWfoUhSfSaeienSYYhSoWhYUhWfoUhUhSYSnSfSbShehdmYhafYYhahoSYWhoSYWhnSZShWdnSYeVRlUhcffUhcffUhXfhfUhUhUhYfYfchfYfchfYfchfYfcifYfYfchfYfYfUfVdiVhfUhfomffYfYfYfYfYfYfcnhYfUhcffYfUhYfYfYjccfYfchhYfcmhchfUhUhccdYfcjicjldYWhUhcffUhVhfUhXdfhSfTffUfYhYhcefYhYeUfVdiVhfUhehliSfeofhSfafhSfafhSfafhSfafhSfafhSfaehYhaffYhenhhSfehhhSfehhhSfWhhSfWhhSfWhhSfWhhSfefhhYhSfYffWahfSfWhhSfWefUhUhchdYhcfhYhcfhYheeijSfSfeiffYfWhhYhYhVdhYhYhYhYhYhdbhfUhchfYhYhYhYhYhcbhYhYhYhYhYhYhUhUhUhUhchiafhSfUhcffUhUeUfUfYfchfYfYfYfcefYhYhYhYhYhWmhUfUfUfcffcffYfcffYfYfYeekceYhYhcehYhYhcehYhYhcehYhYhUcUfYhUfVdiVhfUhen2mfQScfWehSfSfUhShShUhSeXdihSfSffjjhfYcftmffSifehfhShSe'
    //     }
    // }, {
    //     name: 'duck',
    //     vision: 1,
    //     category: 'small',
    //     size: 2,
    //     shape: {
    //         hash: '#C/2ecc713498db34495ee67e22ecf0f108853263454ea88d8d0505056e4d4dede51f:A/ZijVjkShUhSfUhShWfbUhWfiShSeWhifhhjffedfhYfYfYfSfWhhUhWfbUhehflYhYhUhYfYffkihfSeUfSfffkdfShShShShShafbYfYfYfShShShShShYhYhYhXWeeShaefShYfdjjkYfYfeiicYfYfeffhUhWfhUhWfhUhWfhUhffiffUfWhhWfiUhfhkffUhUhckeUhUhSfSfachSfajdYfYfailYfYfeiebYfYfUhYhYhedfjShUhSfehfiYhYhUhYfYfejffSfUhShcfhYfYfSfYhYhaefYhYhaefYhYhfcTjeSfYhYkahhSfdfjkYfYeYfYiehhhSfSfSfSfafkSfSfSfSfafjSfSfSfffohhfkfhcSfSfUhUhShShUfTfkfcffcUhUhWehShUhUhSfflamiUfcahUfemheUfWheffiieSfSfSfSfSfYfYfYfYfajlYfYfYfScShShShffdhiUhSdUfehiiSfSfSfSfWfkSfSfSfWfjSfSfSfSfUhchfYhYhcehYhYhcehYhYhahkSfSfSfSfWfkSfSfSfSfWfkSfSfSfSfXfihSfbelfYfUfYhYhUhcehYhYhWfhYfYfUhYhYhaehUfYhYhUhYffflXkYiYfahfYeYhahfYfYffjVlZYhaefShYeYfYfSfYhYhejhiUhWeeYhebhiUhfkhfkSfSfafiSfSfafiSfSfafiSfSfafiSfSfffjkfahhYhYhYhYhUhUhcffYfYfYfcjhYfYfYfeldeShShShShaabShShShShSh'
    //     }
    // }, {
    //     name: 'elephant',
    //     vision: 4,
    //     category: 'large',
    //     size: 8,
    //     shape: {
    //         hash: '#C/2ecc713498db34495ee67e22ecf0f18eb2b9332c57:A/XiklUhSfUhWefUhUhUhchdUhUhUhefdhWihUhSfUhShehcfUhUhYiaffaihcfiYhUfUiYfUeYfUiUfWffembmWhhYhUhWefefihWffYhUhYfUhYhShYfchhUhUhUhUhUhUhUhWZfUhUiUhUiUhefZhUhUhUhUhUhUhUhWZfUhUiUhUhUhUhWXfSfSfSfSfSfahlSfSfSfSfSfWehSfWhhSfcffUhehilSfaffYhaffYhaffYhSfUhUhUhUhUhUhSmWhaUhSlSfSfSfSfeeZmYfYfYfYfYfYfYfchdYfchhYfUhYhcfiUhUhUhUhUhUhYhYhYhYhYhYhYheZbhYfYfYfUhUhUhUhUhUhUhUhUhUhckWYhWffehhhYhYhWffYhYhefhhYhYhYhYhYhYhYhYPUhUhQUhUhUhUhUhUhUhUhcxXUkUhUhUhUhUhYRYhYhYhYrYfYfYfYfUfUfcZhUfYhYhYhYhYhYhcYZQUhcffahhahfYhYhcfhYfafhYhYhahfchfcfichfUheidfeejiYfaffYfYfahhYhchhSfYhefhhefffYfYfWfhchhYhcfhcffaffUeehjhSfWhhYhehffefihYfcffahfefhhchhYhcfhcffcihchfcfiYfcffUhYfUfenWeYfYeedmhWdhWhfShcedYhYhcehYiYfcfpQUfUfUfUfcheYfchfUfcfhUfcijYfYfchhUhciZYhUhchfUhYhUfQYhUhcfhcihcfhUhYeUhUhchhcfhcifcffUfchhchhYhcffcffcjiYhcefcffUfUfchhUhcjicefUfcfeUfcefcjhUichhUhcihcffcfecffchfcdfUfckicfhchhUfchfcceclicfhUhchfchfcbecefcjhcefcjhcefcjhcjicdfckhcdeYhYhchjcdhcehchhchhcehYhcifcffcihcehcehYichfcifcfhehZfUhUheYehYhYhYhehffehhhYhYhYhUfUfYfYfYfYfYeYhekhfYfYfUhYhYhUhYeUhYhYhUhYfYfefhhaffYjYhcdfciiYhYdYhcfhYhYheidhcefYhcfhYhchhUhecffYhahhYhUhYfciiUhYfYfYeebehYhUfYfUfYhUfYfUfYhUfYfUfYhUfYfUfYheefeUfchhUfchhUfchhUfchhUfechhUfYhUhYhUfYhaifUhaciYhcffYhefphUfUfUfUfUfUfUfUfUfchpUfUfUfUfUfUfUfUfUfUeYfehhfYfUfYhWhhShaffShUfYhWhhYfUfYhedjcUfaffUhYfUfahhUhYfUffhkhdfndfjUfehhfUfeehhUfcfhYjUfffhhfUfShUhaZfUfWhhUffnkfefZofjfoVhfUfWhhUfeXhfUfShUhfqnehebiiYffkScfYhYYYfTfhYhcfhUhUhUhchdejlhUhSfcdbUhUhUhWhhUhSfWhhUhenkhYfYfYfYfYfYfYfYfcnfYfYfYfYfYfYfYfcfhchhYfchhYfcfecuhUhYfYfYfefUYWdhUhUjShShWfhchhYfWhfSfafhSfahfYfWhhSfYhSiefhfSfWfiUhYhaefShWhfWffefhhejfeehelUfcfhedieejehecifWhfchhYhaffcifeehfafhehhfekelaadaihejeiecieejeiecieekekSfWhhcffehhhaffchhechcekeiaeiaifUhafhaheecieejejecidchhWffekfkShebicelfkcffehhfWeiacfeehfUfWhfekfiecieejeiedjecffehffekfiecieelciebkdafhehffchfWifYfcifSfchheehhUeaheejfhedifShcffejehedjeehhhYhYeaifekbkQYhcchechfajhaifahfahfcehahhcdhWhhaffafiYiYfeffhSfWhhehffShUhehffSfahfShShafhaifSfSfaffUheifhSheehhafhchfefffYfYiUfchhUfeehfejfhcffchiaefYiYfeifhaffaiheffhYhaffcheefhiahfShWedSfSfUhShShUhaffUhchfSfcfhahhShShefhfSfehffWhhShSecehUhYhYhcffYhafhYhafhYhefhfYhafhYheffhYheZfjSfYhYhUhYhYhSfYhYhYhUhaffYhaehQUhchfeehfchfUhafhWfhYfYfeffhaffcfhehfhehifYhYeUfcjhYiYfabeSicfeUheihaYhckbUhchhYfchhUhUhShShShShShafeYfYfSiafdYhYhYhSfYfehffUhcffUhYfcjZUhUhcfjYfYeecZlYhaffSfehedYfahhYfWhfUlUhUhchZUlefdkWedWiiSiWihUhUhUhWcfSfSfWhiSfSfWhhSfSiUhUhUhWefSfSfSfUhShShShUhSfUhWffUhWffSfUhShWhhahhafjSeShSeahfSfSfafhSfehchSfWhhSfWhiSfSfWhhSfWXhehmlaicUfeehjSfYhSfekdjSfSfSfSfSfSfUheffmSfSfSfSfSfSfafmSfSfSfSfSfSfafmSfSfSfSfafkSfSfSfSfafkSfSfSfSfSfefejSfUhSiejhbYfefjjQSfehfiefhjehfcWfhWheaflWffahdefhjYfehffahdefhjYfahfahcafjWfhWheWfhaihahiehhfafheffdahiahcWhjafhSfUfQSfUhafdWfiYhUhSfSfWhhSfWhhYfeffhaheYfUhShcjeWffafhaffaeiajechhUhUhYeYhcficefefelahbWhhSfaifYhUfYfchfYfdhfhYf'
    //     }
    // }, {
    //     name: 'fox',
    //     vision: 5,
    //     category: 'medium',
    //     size: 3,
    //     shape: {
    //         hash: '#C/2ecc713498db34495ee67e22ecf0f1:A/fkikkShYfYfYfYfaihYffhhffYfYiYdahhYhbfhfYhdffiYhadediifYhcehYhYhYhddffYjdhfiYbVhfUhclfUhSfYfYfYfYfYfVhfYhcfhYhcjfYhcfhYhVcicbfUhVhfYlabfaihSfaihYfSfaehSfUhYhYhYhYhUfUfYbUickfWfhYfYfYfSfYhYhYhdhfhafhYfYfYfaffYkYfYfYffjjffYfYfchdYfcfhUhYjSfWfhYeYhSfWhhYfSfYhSfUhSfahiSfadiSfYhSfahhehedSfedfhUhehfjSfSfSfSfahkSfSfSfSfWhiSfSfSfaflSfSfSfSfSfWhiSfSfaflSfSfSfSfSfehhjSfafiSfSfSfSfeifjSfSfSfahkSfSfUhWffUhafhSfahfUfUfadhehffYhehjjUeYdSdfjfmhSfUhaffYhUfSfSdShThfSdSfWhhSfWhhSfWhhSfadhaifYfYfeifhUeYfahfYfehhhSfYfchhafhSfafhSfWfhSfWfhSfTihShSiShShShWhfSffhideSfahfThhaffaheYfahfYfSfYhSfYfTffZhhTffYfahfYffhfmhSfSfSfafjSfSfSfSfZhfSfSfYfShfidnhUfYdUhWfnUhcjfUh'
    //     }
    // }, {
    //     name: 'lion',
    //     vision: 6,
    //     category: 'large',
    //     size: 5,
    //     shape: {
    //         hash: '#C/e83a98b0732c273645e67e22ecf0f18f2121ebce36:A/ehjaShaefUhYfYiUfYeShUhcifYfUhYhafeeefhShekijcdeYfUhYhYhYhYhcefYhYhcfiYfeehjShYlcbdUhUhcleUhUheeeaafhchhefffYfehhhcffUhSfeifkUhUhefefUhWfhUhYfUhShcieYfYfchhYhWfhYfYfchhYfchhYfchheideShWhfUhWfhUhWfhUfUicffWhfehhhWddUhUhcehejeiUfacfSfUhYfUhShUeShUhUhYlcaeShUhSfUhShXchhYhYhYhYhYhYhYhYhYXUhUhUhUhUhUhcpbUhUhUhUhUhfceffcehYiaeefecjhQUhchfYjYhYhYhcfhYfYfYecehQShehffchhYfefhhahfWfhYhahfYhYhYhchfUhUhUhYfYfYfYfYfYfchfQShahfYhYhYhafhYfacfQUhchhYhYhWfhUhchfWhfYhYhafhYhahfYZcmhYfYfYfYfYfYfejdhclhcffUdchfcekcdjcfeYfYeUfchhUhYhUbYhchfciiYhUfchkUhYdcfbccfcmjYhYhUfchfUhUhUhcajckecchcfecfeYiYicheUhYfUfYjYfYachicffYfUhUhcjdYfcklfddhfYjYfYfcfhUhUhYjUfUfcfiaehUfUfYhYhUfYfYfeiihYfcffYhYhUfYfYfeffeYiYfYiYhcchUhUhUhdmdhUhUhYZUfUfUfcfjUecheYhYhYhYhYhYhchhefldYfYfYfYfYfajfYfYfYjaffYffecfffdekhShUhSfUhShUhSfUhShUhSfUhaifahfahfahffhepfYfaffaiiYfaffUfYhYhffiiichfbefeXhhiYicefYhUffffejYhYhcefYhYhXmccehhfYfYfYfYfejffYfYfahfaciYoeZeicmcUhUhUhUheeicYeahfWhhShcifYccjhYeSiYhYhefehYhYhcfhYecffWhfYfcefchhcihckfUhchfYhcYfYpfdfjhYcficijYfYifheSfYhYbaenYnYhfYijdUifhcWjfjoddfifulYfYdbhfbThlehffWdeehhhcffUhShUhShUhehefeeiiYhehffUhShadhYhYhYhYhachYhYhYhYhachUfUfYhcjhUfYfedfcShShWfhShekheWfhSheefeYhYhYdYfShYhYhYhYhShYfYfYfYfeihcShaffShaffShShWkeUfUfShUhShUfWhhUfckhSfSfSfUhWeiSfSfSjWfeSfWfiaffSfahhSfeiebWhhSfWhhSfUhShUhSfUhShUhabfYhYhYhYhYhadfYhYhecffYhYhUhYhYhWffYbYhcfhYhYhYhYhYhYaahiahfYfYfShShShYfSfUaUhchfThefjkWiUhUhUhejeoSfWffShShWfeSiSfWfhSfSfWejUhfchibYhbjelWfhUheaffelhhYfahfSfSfSfSfSfSfSfSfafoSfSfSfYfahfSfSfYfahfSfafhafoSfSfSfSfSfSfSfaheafhaflSfSfSfSfSfSfYhaemahhafeSiahiSfYfShYfSfWhhSfWhhSfUhShahcShShchfaffSfSiUfSfSfakfahfShefhfahhSfWhhYcYhYhYhahdShShaffShSeafhWfhcfhYhaffafhSfWeiSfWhhSeShSeSfeffhShWffShehffYfchfYfeljfYfYfYfYfchhYiYhUhYfYfShYfSfYfShckfShehffShUfSfcfeYhUhShaffaaoahZYhYkabnfkjnfYfYfXfhfYi'
    //     }
    // }, {
    //     name: 'penguin',
    //     vision: 2,
    //     category: 'small',
    //     size: 2,
    //     shape: {
    //         hash: '#C/2ecc713498db34495eeddc3eecf0f1384ec2:A/bknjSeShfhjfiYfchhYfUhXdhfShWhfShWhfShWhfShWhfShWhfShcfbUhUhUhUhUhcfbUhUhUibiehUhWhiSfSfafiYfcihUhYfYfeifeUhWZfUhUhUhUhUhUhUhSiVfdfdZhiUhUhUhUhUhcfbUhUhUhUhUhdhhhYfekaefejifUidhihYeYfZieShffhfiYfWefSfSfXhidTfjSfUhShShUdSfWfhSfWhfUfWfiSfSfWfiSfSfWfiSfWfhSfSfbjifYfYfaifYfYfbifhYfYfeeihUfUfYfYnYhaefcfhYfYfchhYhUhYfYfUhYhYhUhYfYfUhYhYhUhYfYfeihiSfSfafiSfSfafiSfSfcfZXdjeSfSfajiSfSfaeiSfSfcihYeXjfieiefYfYfcihYfYfYjUfcchUfckiYfYfYeYh'
    //     }
    // }, {
    //     name: 'pigeon',
    //     vision: 1,
    //     category: 'small',
    //     size: 2,
    //     shape: {
    //         hash: '#C/2ecc713498db34495ee67e22ecf0f1a8859663454ee3cccc050505:A/ZijVjkShUhSfUhUhSfWfiUhWebUhUhUhUhWciShSeUhUhWfiSfUhbhkffedfhYfYfYfSfWhhUhUhUhUhUhWbbUhUhShWhfUhehclYhYhUhYfYfUhYhYhfeeheYhYhUhYfYfUhYhYhWfhYfYfUhYhYhXfhhYfYfUhYhYheiheTffUfXhfhUfWhfUfTffSfWhhSfbfkiSfSfSfSfUhShShShShcffYfYfUhYhYhUhahbShShShShShXhbeShShShShShafbYfYfYfShShShShShYhYhYhXWdeShShahhafcYeShShShafhSffhphkYhaebejakYfYfeiicYfYfUhUhUhUhchdYhcfhYhcfhYhcfhYhedbhUhWfhUhUhWehUhUhWehUhUhUhSfWhhSfWffSfWhhSfUhShShShffedeUfWhhUfXhhhUfShUhXfhfUhXfhhUhfhkffUhUhckeUhUhSfSfachSfajdYfYfailYfYfeiebYfYfUhYhYhffffhUfSfUhXhhefefkhShUhSfehfiYhYhUhYfYfejffSfUhShcfhYfYfSfYhYhaefYhYhaefYhYhfeTfeYiackSfSfSfehhjUhWefekhhUhWefahhSfSfSfVoiShSjTehShSiffbdhYfYeYfYiehhhSfSfSfSfafkSfSfSfSfafjSfSfSffekheShSjTfhSfSjfhkbifkfhcSfSfUhUhShShUfTfkfcffcUhUhWehShUhUhSffieciUfejeqUfUfcaiUfUf'
    //     }
    // }, {
    //     name: 'turtle',
    //     vision: 10,
    //     category: 'small',
    //     size: 4,
    //     shape: {
    //         hash: '#C/2ecc710c822d34495ee67e22ecf0f100000058a8328c5b11614612000000a66a11:A/bfphVhlZhkZheZhfZhjddhdYjZfhZfiYjZbeVhfZhjZheddfZUhcffUhWffSfSfSfahjSfSfSfYeehhjSfSfSfYhSiShSebhfmVfhVeZVhlZhkZheZhfZhjddhdZhjZhecfhZfidjfdZhjbbjeSfSfahiSfSfWfiSfSfahiSfSfYhYhafhShYhSfecihSfSfVhfSidhfhSfSfehfiSfSfWhhShSedfhiSibheeSiaffZfifldicScXfkbSceYihShShShXhcjSkTdlThYThoVhbShScShThiahiYhafcYhafhYhafhYhShYfVhbYhafeShahfShfkdhnSfSfahiSfSffeihfehfiScbhkhScafiSfSiUhSeThidhfeUhWfhSeXhifSefhfijSeTheWfhSfSfXfhZYhVhpTfdSifhfff'
    //     }
    // }, {
    //     name: 'wolf',
    //     vision: 6,
    //     category: 'medium',
    //     size: 6,
    //     shape: {
    //         hash: '#C/2ecc713498db363636e67e22ecf0f190ff039ca8adb8bac265686ee64949:A/babnYfahfYfSiYhWhfShaffShXhfhShahfShefhfShUhSfTfeWffUhXhhiSfUhShWhfSfSfXcheUhUhUhXdfhUhUhVhfViiShShUhWfhUfShShShShWedShWhfShXfafVhfXffhUhfjhihYhfdfefYhYhYhbdhfYhYhYhYhfchhfYhYjYhZhjffffebffhYhfbiihYhYhYhYhYhYhaahYhYhYhYhYhYheZihcheYhYhYhYhYhcchUhYfVffdmfhUhYeZhfdhhhYfYfficcfThfShShXfdhUfcfhYfYfYfYfYfclfYfYfYfYfYfYffkifbYfUfYhchhYdffimmYhYhYhYhYhYhcfhYbYhUhYfcffUhclfUhYhchfUhfeaccYhYcYfckfYhYcYffffhjSfYhYhYhYhYjSheZifYnShWhfShcadclhYheeffYhfhlihShShXeeeUfShVhiShWhfShWhhShShShafdYfYfYfYfYfcmhYfYfYfYfYfYfYffhadeShYfSfcnhShWfffbhfjYjYfYfdffdYhYhYhYhachYhYhYhYhachYhYhYhYhYhWiheaffYhYhYhYhYhebhhYhYhYhYhYhfbjiiYhYhYhYhYhVZfYhSfaffYhafhchhYfShYhdfhhYhaffYhcahYmShYfacfYhYhYiYfcihShWhfShWhfShSheadfefihYneZiiWefShUhWfhShUhScShSiUhShenedUhShShShShWhdShShShWedShShShfZfbeUfWhhUfWhhUfenheUfWhhUfWhhUffZhhiShShWfeShShenheShShWfeShSheZffShSeanhShSeXeifYfahfUhWffYfShehhhYfSfXicfShShafeShTeiYfYfYfbfheYhYhYhShahhYfaffShaffShaffShflfhiShShWheShShdadfYhaffSfYhShUhYfShYhXhfhShSeWhiSfSfefiiUhUhYhYhYhYhYhYhSbYfYfYfYfYfShShShaheShShaheShShaheShShaheShShaheShShShYfYfYfYfefdhalfUhUhWehUhUhcbfchfUhehhVaerYhYjYfchfYfYfUhciefdfeeYhShahfYhaeiaffYiYhShYfYechhYhffhhiYhcfhYhcfhYhcfhYhcfhYhcfhYhaffYhSfYfdhfeYf'
    //     }
    // }];

    $scope.builder = function(slide) {
        CreatureFactory.currentCreature = slide;
        console.log(slide)
        $state.go('builder');
    };


})