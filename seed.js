var mongoose = require('mongoose');
var startDb = require('./server/db');
var Promise = require('bluebird');
var chalk = require('chalk');
var shape = require('./shape');

// Models
var Coordinate = mongoose.model('Coordinate');
var Creature = mongoose.model('Creature');
var Shape = mongoose.model('Shape');
var User = mongoose.model('User');
var World = mongoose.model('World');
var Level = mongoose.model('Level');

var shapes = [];
var hashes = {
    beaver: '#C/2ecc713498db5e2f0c261506ecf0f18e9091:A/bkmjaffYhafhVhfSfYhShUhSfafhSfehhhShaffShahhYfchhVhidffeVhhdfffYfYfcihZfhZfhdkheYfYfYfYffhehjYiZfedhfiYeYhVfffiieeUhUhYcUfUfeifhYfYfSffhdehYfahhYffhhffYfShYhUhYfSfYhefhhYhcjjSfSfSfSfSfaclSfSfSfSfSfajmSfQSfQSfQSfQSfQSfQSfQafnQSfafhafZahmahfYfahfYfahfYfahfYfahfYfahfYfahfYfajhaffYdahfajheedoSfaifSfSfSfSfackSfSfSfSfekilSfSfSfSfSfUfSfUhSfUfWfhSfecinSfSfSfSfSfSfSfekfnSfSfSfacjSfSfSfSfSfSfSfWfhSffkdhhSfafhSfYdShfjjlfSfSfSfSfSfYfahfSfaenSfSfSfSfSfSfSfahhdfdhShfhjlfSfSfSfSfSdeieiYfahfYfchhYfeefhUhcffUhWffYhUhYfekijefeeYhWheYcUhUhUhYiYhYhUfUfYfYfYfcihYfYfbifhYfYfaifYfYfaifYfYfaifYfYfbksfYabkThYfYfeifkYfYfSfYhYhaffYfYiSfYfSfafhSfYi',
    chick: "#C/2ecc713498db34495ee67e22ecf0f1d92323000000:A/flkhkYhShShShShSbYfSlYfYfYfYfclhUhUhUhUhUhUhUhUhUhUhWWbShWhfUhUhUhUhUhUhUhUhUhShShShShWWeShShefqhYfYfehVbYfYfakfabhSfYhYhYhYhecrmYhcjeYfYfYfYfckfcfiYfYiahfSfWfhSeThiXZheSfSfSfWfeUhUhUhUhUhUhUhUhUhUhWYlSfSfSfWhjSfSfSfWhjSfSfSfWhjSfSfSfWhjSfSfSfWhjSfSfSfUhUhShedejeiYdShfdchfYeaifSfSfSfafhSfYfSiSfSiahfWhfUhUhVhhShShfiojfShbhehchfYfYfYfYfchhYfWYfYkYfYfYfaifSfSfafiSfSfafiSfSfficjfScShShShaihSfSfSfSfYfShShWhfUhUhfbhehShShShShShShclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfclhYfYfYfYfYfUhUhUhcihYfYfUhWefTfiXYheSfSfSfSfSfWhlSfSfSfSfSfWhlSfSfSfSfSfWhlSfSfSfSfSfWhlSfSfSfSfSfWhlSfSfSfSfSfWhlSfSfSfSfSfWhlSfSfSfSfSfWhjSfSfSfWhlSfSfSfSfSfWhlSfSfSfSfSfallSfSfSfSfSfaflSfSfSfSfafkYfahfSfSfSfSfafkSfSfSfSfafkSfSfSfSfYjffhkhfefhffihehSfSjWhfSeXaleShXffifjaYfYfYfYfYfYfYfamfYfYfYfYfYfYfemhhSfaahSfemhhSfaahSfanmUhWffUhSfUfWhfUfWhfUfehhkUfWhfUfWhfUfWhfUfWhfUfeehfSfaahSfemhhSfaahSfahhYhYhYhadfYhYhYhYhShSeYfYfYfYfckcYfYfYfYfckhUhUhcceUhUhcjeYfYfUhYhYhcehYhYhedijUhUhUhUhUhchbUhUhUhUhUhchbUhUhUhUhUhchbUhUhUhUhUhchbUhUhUhUhUheaZkUfWhfUfWhfUfWhfUfWhfUfefhkUfWhfUfWhfUfWhfUfWhfUf",
    crocodile: '#C/2ecc713498db000000e67e22ecf0f14dbd3a010f01148c2e:A/bfmlShShShYhYhYhSeShSeSffehkfYhYhSfSfSfadiSfSfSjdhhhYhYhSfSfSfWeeSfWjmcdfSfSeWefSfSfSfYjediiSeajjSfSfSfXfjfSfSfSfadjSfSfSffifmhSfSfSfSfSfSfafmSfSfSfUhWffSfSfehimYfaheYfaheYfaheYfaifYfYeYhcihYecieUfYfYeYhcfhYhYhchjYfYeYheecoQSfSfSfSfSfSfSfSfXhofQSfSfSfSfSfSfSfXhnhQSfSfSfSfSfSfSfSfUfWioSYUhdjfhYefjdffYfYfYfYfUhYhYhYhYhUhYfYfYeYhcfhYhYhYhYhUhYfYeYfYiejcfYfYfYfYfahfYfchhYfeffhUhYfekffQYhYhWhhYfYfadfYjYhYhWfTYfYfYfYfYfYfamsSeSfUhWffSfSfSfSfSfSfSfSqUhShSeehfkSfahhSfYXShaifcfheefhSfaidSkSfSfSdSiSdSfSfSfSfSfSfSfaffShaffShapfShYhSfeYhsSfSfSfSfSfSfSfSfSfSfSfSfYhYhYhYhYhYhSoSfSfSfSfSfSfSfedfnQUhWfhYhahhShYfYfchhWfhYfWhfeffhSeaffShShShWhfWfdUhSiYhWfeafdShShUhWfdahhWhjWfeWhfSieiffSkWheWffUhSeehfkSfSfSfWhheffeWhfeffiShSeWhiSecifUhWffUhSeeefiYfUhWffYhWhfeefhSfUhchfejhpaffYfefffSieihXeeffcjhcefYeWhjeifbYhYeaheSfSeSfSeafmSfSeSfSeaimSfSeSfSeaefYhYhaefYhYheeh2SjajcSeacdaifafeaffaiteifedchiYhYhYhYhacdYhYhYhYhacdYhYhYhYhacdYhYhdhfeYhdfhiYhedhzYhYhaeeYhYhaeeYhYhelecSfaUhSfasUSfYUShYndeheYhYhfffdiYhYeaidYfYfaidYeYh',
    deer: "#C/2ecc713498db34495ee67e22cfd1d10000008c4e15eddb9d570a0a:A/bdkoVhfUhVhfUhSfUhUhSfSfUhShShWheShShfheehUhWfhUhShUfShUhShUhShUhShUhUhUhXcdfWhhWhhUhUhXhhhUhXfffVhhffbdfSfSfehhkUhUhUhUhUhShShShYhYhbehhYhYhfehffYhYhcehSfWffUhXfjhYhYhfefhhYhchhUfcfhYffhheeYhaffSfahhSfXhhhUhYhcdfUhYfYlYaYfYoSfSfSfaYiSfSfUhUhUhcoeUhUhaYhShaofShWhfUhcYfUhYhYmeZeiYoShYYcohUhcYfUhUhYoYZYhYlYfeadhShaofShaYhYocYhYocZhYnYfcZdYoebRVUhWffUhWffUhdfffUhUhUhSfSfWfhSfWfhSfWfhSfWfiSfSfWfhSfSfUfVdiVhfUhfhmofSfSfSfSfSfSfWhnSfUhWffSfUhSfSfSjWfcSfWhhSfWhmWfhUhUhWdcSfWijWljXWYhUhWffUhVhfUhdhdhYhZhfUfShShWfeShSeUfVdiVhfUheelhYheffoYhaffYhaffYhaffYhaffYhaffYhafeShahfShefhnYhefhhYhefhhYhcfhYhcfhYhcfhYhcfhYhefhfShYhSfffaWfYhcfhYhcheUhUhWdhShWhfShWhfShedieYhYhehfiSfcfhShShVdhShShShShShXhbfUhWfhShShShShShWhbShShShShShShUhUhUhUhWihaffYhUhWffUhUeUfUfSfWfhSfSfSfWfeShShShShShcfmUfUfUfWffWffSfWffSfSfSeeickShShWheShShWheShShWheShShUcUfShUfVdiVhfUhea2nfkSQfcfeYhYhUhYfYfUhYidedhYhYhffjjfScfhmtfYefhhehYfYi",
    duck: "#C/2ecc713498db34495ee67e22ecf0f108853263454ea88d8d0505056e4d4dede51f:A/ZejVjkSfUhShUhSfWflUhWfeSfSiWheffhdffidhhYhYhYhShWhfUhWflUheffbYfYfUhYhYhfciffSiUfShfhkjfSfSfSfSfSfahlYhYhYhSfSfSfSfSfYfYfYfXWieSfaihSfYhddjkYhYheeikYhYhehffUhWffUhWffUhWffUhfhihfUfWhfWfeUhffkhfUhUhcceUhUhShShakfShadjYhYhaebYhYheeelYhYhUhYfYfejfdSfUhSheffeYfYfUhYhYhedfhShUhSfchhYhYhShYfYfaihYfYfaihYfYffkTdeShYfYcaffShdhjkYhYiYhYeefhfShShShShahcShShShShahdShShShfhofhfcffcShShUhUhSfSfUfThkfkfhcUhUhWefSfUhUhShfbaaiUfcmhUfeahiUfWhifhieeShShShShShYhYhYhYhadbYhYhYhSkSfSfSffhdfiUhSjUfefieShShShShWfcShShShWfdShShShShUhcffYfYfcihYfYfcihYfYfafcShShShShWfcShShShShWfcShShShShXfehShbibfYhUfYfYfUhcihYfYfWffYhYhUhYfYfaifUfYfYfUhYhfhlpkYeYhafhYiYfafhYhYhfdVbZYfaihSfYiYhYhShYfYfedheUhWeiYfelheUhfchhkShShaheShShaheShShaheShShaheShShfhjcfaffYfYfYfYfUhUhchfYhYhYhcdhYhYhYhebdiSfSfSfSfamlSfSfSfSfSf",
    elephant: '#C/2ecc713498db34495ee67e22ecf0f18eb2b9332c57:A/XiklUhSfUhWefUhUhUhchdUhUhUhefdhWihUhSfUhShehcfUhUhYiaffaihcfiYhUfUiYfUeYfUiUfWffembmWhhYhUhWefefihWffYhUhYfUhYhShYfchhUhUhUhUhUhUhUhWZfUhUiUhUiUhefZhUhUhUhUhUhUhUhWZfUhUiUhUhUhUhWXfSfSfSfSfSfahlSfSfSfSfSfWehSfWhhSfcffUhehilSfaffYhaffYhaffYhSfUhUhUhUhUhUhSmWhaUhSlSfSfSfSfeeZmYfYfYfYfYfYfYfchdYfchhYfUhYhcfiUhUhUhUhUhUhYhYhYhYhYhYhYheZbhYfYfYfUhUhUhUhUhUhUhUhUhUhckWYhWffehhhYhYhWffYhYhefhhYhYhYhYhYhYhYhYPUhUhQUhUhUhUhUhUhUhUhcxXUkUhUhUhUhUhYRYhYhYhYrYfYfYfYfUfUfcZhUfYhYhYhYhYhYhcYZQUhcffahhahfYhYhcfhYfafhYhYhahfchfcfichfUheidfeejiYfaffYfYfahhYhchhSfYhefhhefffYfYfWfhchhYhcfhcffaffUeehjhSfWhhYhehffefihYfcffahfefhhchhYhcfhcffcihchfcfiYfcffUhYfUfenWeYfYeedmhWdhWhfShcedYhYhcehYiYfcfpQUfUfUfUfcheYfchfUfcfhUfcijYfYfchhUhciZYhUhchfUhYhUfQYhUhcfhcihcfhUhYeUhUhchhcfhcifcffUfchhchhYhcffcffcjiYhcefcffUfUfchhUhcjicefUfcfeUfcefcjhUichhUhcihcffcfecffchfcdfUfckicfhchhUfchfcceclicfhUhchfchfcbecefcjhcefcjhcefcjhcjicdfckhcdeYhYhchjcdhcehchhchhcehYhcifcffcihcehcehYichfcifcfhehZfUhUheYehYhYhYhehffehhhYhYhYhUfUfYfYfYfYfYeYhekhfYfYfUhYhYhUhYeUhYhYhUhYfYfefhhaffYjYhcdfciiYhYdYhcfhYhYheidhcefYhcfhYhchhUhecffYhahhYhUhYfciiUhYfYfYeebehYhUfYfUfYhUfYfUfYhUfYfUfYhUfYfUfYheefeUfchhUfchhUfchhUfchhUfechhUfYhUhYhUfYhaifUhaciYhcffYhefphUfUfUfUfUfUfUfUfUfchpUfUfUfUfUfUfUfUfUfUeYfehhfYfUfYhWhhShaffShUfYhWhhYfUfYhedjcUfaffUhYfUfahhUhYfUffhkhdfndfjUfehhfUfeehhUfcfhYjUfffhhfUfShUhaZfUfWhhUffnkfefZofjfoVhfUfWhhUfeXhfUfShUhfqnehebiiYffkScfYhYYYfTfhYhcfhUhUhUhchdejlhUhSfcdbUhUhUhWhhUhSfWhhUhenkhYfYfYfYfYfYfYfYfcnfYfYfYfYfYfYfYfcfhchhYfchhYfcfecuhUhYfYfYfefUYWdhUhUjShShWfhchhYfWhfSfafhSfahfYfWhhSfYhSiefhfSfWfiUhYhaefShWhfWffefhhejfeehelUfcfhedieejehecifWhfchhYhaffcifeehfafhehhfekelaadaihejeiecieejeiecieekekSfWhhcffehhhaffchhechcekeiaeiaifUhafhaheecieejejecidchhWffekfkShebicelfkcffehhfWeiacfeehfUfWhfekfiecieejeiedjecffehffekfiecieelciebkdafhehffchfWifYfcifSfchheehhUeaheejfhedifShcffejehedjeehhhYhYeaifekbkQYhcchechfajhaifahfahfcehahhcdhWhhaffafiYiYfeffhSfWhhehffShUhehffSfahfShShafhaifSfSfaffUheifhSheehhafhchfefffYfYiUfchhUfeehfejfhcffchiaefYiYfeifhaffaiheffhYhaffcheefhiahfShWedSfSfUhShShUhaffUhchfSfcfhahhShShefhfSfehffWhhShSecehUhYhYhcffYhafhYhafhYhefhfYhafhYheffhYheZfjSfYhYhUhYhYhSfYhYhYhUhaffYhaehQUhchfeehfchfUhafhWfhYfYfeffhaffcfhehfhehifYhYeUfcjhYiYfabeSicfeUheihaYhckbUhchhYfchhUhUhShShShShShafeYfYfSiafdYhYhYhSfYfehffUhcffUhYfcjZUhUhcfjYfYeecZlYhaffSfehedYfahhYfWhfUlUhUhchZUlefdkWedWiiSiWihUhUhUhWcfSfSfWhiSfSfWhhSfSiUhUhUhWefSfSfSfUhShShShUhSfUhWffUhWffSfUhShWhhahhafjSeShSeahfSfSfafhSfehchSfWhhSfWhiSfSfWhhSfWXhehmlaicUfeehjSfYhSfekdjSfSfSfSfSfSfUheffmSfSfSfSfSfSfafmSfSfSfSfSfSfafmSfSfSfSfafkSfSfSfSfafkSfSfSfSfSfefejSfUhSiejhbYfefjjQSfehfiefhjehfcWfhWheaflWffahdefhjYfehffahdefhjYfahfahcafjWfhWheWfhaihahiehhfafheffdahiahcWhjafhSfUfQSfUhafdWfiYhUhSfSfWhhSfWhhYfeffhaheYfUhShcjeWffafhaffaeiajechhUhUhYeYhcficefefelahbWhhSfaifYhUfYfchfYfdhfhYf',
    fox: '#C/2ecc713498db34495ee67e22ecf0f1:A/fkikkShYfYfYfYfaihYffhhffYfYiYdahhYhbfhfYhdffiYhadediifYhcehYhYhYhddffYjdhfiYbVhfUhclfUhSfYfYfYfYfYfVhfYhcfhYhcjfYhcfhYhVcicbfUhVhfYlabfaihSfaihYfSfaehSfUhYhYhYhYhUfUfYbUickfWfhYfYfYfSfYhYhYhdhfhafhYfYfYfaffYkYfYfYffjjffYfYfchdYfcfhUhYjSfWfhYeYhSfWhhYfSfYhSfUhSfahiSfadiSfYhSfahhehedSfedfhUhehfjSfSfSfSfahkSfSfSfSfWhiSfSfSfaflSfSfSfSfSfWhiSfSfaflSfSfSfSfSfehhjSfafiSfSfSfSfeifjSfSfSfahkSfSfUhWffUhafhSfahfUfUfadhehffYhehjjUeYdSdfjfmhSfUhaffYhUfSfSdShThfSdSfWhhSfWhhSfWhhSfadhaifYfYfeifhUeYfahfYfehhhSfYfchhafhSfafhSfWfhSfWfhSfTihShSiShShShWhfSffhideSfahfThhaffaheYfahfYfSfYhSfYfTffZhhTffYfahfYffhfmhSfSfSfafjSfSfSfSfZhfSfSfYfShfidnhUfYdUhWfnUhcjfUh',
    lion: '#C/e83a98b0732c273645e67e22ecf0f18f2121ebce36:A/ehjaShaefUhYfYiUfYeShUhcifYfUhYhafeeefhShekijcdeYfUhYhYhYhYhcefYhYhcfiYfeehjShYlcbdUhUhcleUhUheeeaafhchhefffYfehhhcffUhSfeifkUhUhefefUhWfhUhYfUhShcieYfYfchhYhWfhYfYfchhYfchhYfchheideShWhfUhWfhUhWfhUfUicffWhfehhhWddUhUhcehejeiUfacfSfUhYfUhShUeShUhUhYlcaeShUhSfUhShXchhYhYhYhYhYhYhYhYhYXUhUhUhUhUhUhcpbUhUhUhUhUhfceffcehYiaeefecjhQUhchfYjYhYhYhcfhYfYfYecehQShehffchhYfefhhahfWfhYhahfYhYhYhchfUhUhUhYfYfYfYfYfYfchfQShahfYhYhYhafhYfacfQUhchhYhYhWfhUhchfWhfYhYhafhYhahfYZcmhYfYfYfYfYfYfejdhclhcffUdchfcekcdjcfeYfYeUfchhUhYhUbYhchfciiYhUfchkUhYdcfbccfcmjYhYhUfchfUhUhUhcajckecchcfecfeYiYicheUhYfUfYjYfYachicffYfUhUhcjdYfcklfddhfYjYfYfcfhUhUhYjUfUfcfiaehUfUfYhYhUfYfYfeiihYfcffYhYhUfYfYfeffeYiYfYiYhcchUhUhUhdmdhUhUhYZUfUfUfcfjUecheYhYhYhYhYhYhchhefldYfYfYfYfYfajfYfYfYjaffYffecfffdekhShUhSfUhShUhSfUhShUhSfUhaifahfahfahffhepfYfaffaiiYfaffUfYhYhffiiichfbefeXhhiYicefYhUffffejYhYhcefYhYhXmccehhfYfYfYfYfejffYfYfahfaciYoeZeicmcUhUhUhUheeicYeahfWhhShcifYccjhYeSiYhYhefehYhYhcfhYecffWhfYfcefchhcihckfUhchfYhcYfYpfdfjhYcficijYfYifheSfYhYbaenYnYhfYijdUifhcWjfjoddfifulYfYdbhfbThlehffWdeehhhcffUhShUhShUhehefeeiiYhehffUhShadhYhYhYhYhachYhYhYhYhachUfUfYhcjhUfYfedfcShShWfhShekheWfhSheefeYhYhYdYfShYhYhYhYhShYfYfYfYfeihcShaffShaffShShWkeUfUfShUhShUfWhhUfckhSfSfSfUhWeiSfSfSjWfeSfWfiaffSfahhSfeiebWhhSfWhhSfUhShUhSfUhShUhabfYhYhYhYhYhadfYhYhecffYhYhUhYhYhWffYbYhcfhYhYhYhYhYhYaahiahfYfYfShShShYfSfUaUhchfThefjkWiUhUhUhejeoSfWffShShWfeSiSfWfhSfSfWejUhfchibYhbjelWfhUheaffelhhYfahfSfSfSfSfSfSfSfSfafoSfSfSfYfahfSfSfYfahfSfafhafoSfSfSfSfSfSfSfaheafhaflSfSfSfSfSfSfYhaemahhafeSiahiSfYfShYfSfWhhSfWhhSfUhShahcShShchfaffSfSiUfSfSfakfahfShefhfahhSfWhhYcYhYhYhahdShShaffShSeafhWfhcfhYhaffafhSfWeiSfWhhSeShSeSfeffhShWffShehffYfchfYfeljfYfYfYfYfchhYiYhUhYfYfShYfSfYfShckfShehffShUfSfcfeYhUhShaffaaoahZYhYkabnfkjnfYfYfXfhfYi',
    penguin: '#C/2ecc713498db34495eeddc3eecf0f1384ec2:A/bknjSeShfhjfiYfchhYfUhXdhfShWhfShWhfShWhfShWhfShWhfShcfbUhUhUhUhUhcfbUhUhUibiehUhWhiSfSfafiYfcihUhYfYfeifeUhWZfUhUhUhUhUhUhUhSiVfdfdZhiUhUhUhUhUhcfbUhUhUhUhUhdhhhYfekaefejifUidhihYeYfZieShffhfiYfWefSfSfXhidTfjSfUhShShUdSfWfhSfWhfUfWfiSfSfWfiSfSfWfiSfWfhSfSfbjifYfYfaifYfYfbifhYfYfeeihUfUfYfYnYhaefcfhYfYfchhYhUhYfYfUhYhYhUhYfYfUhYhYhUhYfYfeihiSfSfafiSfSfafiSfSfcfZXdjeSfSfajiSfSfaeiSfSfcihYeXjfieiefYfYfcihYfYfYjUfcchUfckiYfYfYeYh',
    pigeon: "#C/2ecc713498db34495ee67e22ecf0f1a8859663454ee3cccc050505:A/ZejVjkSfUhShUhUhShWfeUhWelUhUhUhUhWceSfSiUhUhWfeShUhbfcffidhhYhYhYhShWhfUhUhUhUhUhWblUhUhSfWhhUhefcbYfYfUhYhYhUhYfYffiefeYfYfUhYhYhUhYfYfWffYhYhUhYfYfXffhYhYhUhYfYfeehiThfUfXhhhUfWhhUfThfShWhfShbhciShShShShUhSfSfSfSfchfYhYhUhYfYfUhaflSfSfSfSfSfXhleSfSfSfSfSfahlYhYhYhSfSfSfSfSfYfYfYfXWjeSfSfaffahkYiSfSfSfahfShffpfkYfailedacYhYheeikYhYhUhUhUhUhcfdYfchhYfchhYfchhYfejbfUhWffUhUhWefUhUhWefUhUhUhShWhfShWfhShWhfShUhSfSfSffhejeUfWhfUfXhfhUfSfUhXfffUhXffhUhffkhfUhUhcceUhUhShShakfShadjYhYhaebYhYheeelYhYhUhYfYffhfhhUfShUhXhfefifchSfUhSheffeYfYfUhYhYhedfhShUhSfchhYhYhShYfYfaihYfYfaihYfYffiTheYeakcShShShefhdUhWehechfUhWehaffShShShVoiSfSdTihSfSefhbjhYhYiYhYeefhfShShShShahcShShShShahdShShShfikfeSfSdThhShSdffklifcffcShShUhUhSfSfUfThkfkfhcUhUhWefSfUhUhShfeekiUfedeWUfUfcmiUfUf",
    turtle: "#C/2ecc710c822d34495ee67e22ecf0f100000058a8328c5b11614612000000a66a11:A/bphhVhlTfkTfeTffTfjXhjdSdThhThiSdTleVhfTfjTfeXfjZUhWfhUhcffYfYfYfajfYfYfYfSiejhfYfYfYfSfYiYhYebffmVfhVeZVhlTfkTfeTffTfjXhjdTfjTfeWhhThiXfddTfjbjleYfYfaifYfYfcifYfYfaifYfYfSfSfahhYhSfYfehikYfYfVhfYiXffhYfYfeiffYfYfchhYhYeXhhiYibefeYiafhThifidbcYcdkfbYcehioYhYhYhdchjYkZdlZhYZhoVhbYhYcYhZhiaifSfachSfahhSfahhSfYhShVhbSfaehYhaffYhfhdcnYfYfaifYfYffhiifeiffYcbkfhYcaihYfYiUhYeZhiXffeUhchfYedihfYefiffjYeZhechfYfYfdhfZSfVhpZfdYifffff",
    wolf: "#C/2ecc713498db363636e67e22ecf0f190ff039ca8adb8bac265686ee64949:A/bmlnYhafhYhSeYfWhhSfahhSfXhhhSfafhSfehhhSfUhShTheWfhUhXhfiShUhSfWhhShShXcfeUhUhUhXdhhUhUhVhfViiSfSfUhWffUfSfSfSfSfWejSfWhhSfXfmfVhfXfhhUhfdhehYffjfifYfYfYfbjffYfYfYfYffkhffYfYdYfZfjfhfhebhhhYffliehYfYfYfYfYfYfamfYfYfYfYfYfYfenifcfeYfYfYfYfYfckhUhYhVffdafhUhYiZffdfhhYhYhfeckfTffSfSfXfjhUfchhYhYhYhYhYhcbfYhYhYhYhYhYhfcihbYhUfYfcfhYjfhiamYfYfYfYfYfYfchhYlYfUhYhchfUhcbfUhYfcffUhfiakcYfYkYhccfYfYkYhfhffjShYfYfYfYfYdSfenihYZSfWhhSfcmdcbhYfeifhYffflehSfSfXeieUfSfVhiSfWhhSfWhfSfSfSfahjYhYhYhYhYhcahYhYhYhYhYhYhYhffajeSfYhShcZhSfWfhflhhjYdYhYhdhfdYfYfYfYfakfYfYfYfYfakfYfYfYfYfYfWifemfhYfYfYfYfYfelhfYfYfYfYfYffljeiYfYfYfYfYfVZfYfShahhYfahfcfhYhSfYfdhhhYfahhYfcmhYaSfYhakhYfYfYeYhcehSfWhhSfWhhSfSfemdhehifYZenieWehSfUhWffSfUhSkSfSeUhSfeZejUhSfSfSfSfWhjSfSfSfWejSfSfSffnfleUfWhfUfWhfUfeZhiUfWhfUfWhfUffnhfiSfSfWfiSfSfeZhiSfSfWfiSfSfenfhSfSiaZfSfSiXeefYhafhUhWfhYhSfefhfYhShXikfSfSfahiSfTiiYhYhYhbhfeYfYfYfSfaffYhahhSfahhSfahhSffbffiSfSfWhiSfSfdmdfYfahhShYfSfUhYhSfYfXhhhSfSiWheShShehieUhUhYfYfYfYfYfYfSlYhYhYhYhYhSfSfSfafiSfSfafiSfSfafiSfSfafiSfSfafiSfSfSfYhYhYhYhehdfabhUhUhWefUhUhclfcffUhefhraiVYfYdYhcffYhYhUhceefjfieYfSfafhYfaieahhYeYfSfYhYicfhYffhhfiYfchhYfchhYfchhYfchhYfchhYfahhYfShYhdffeYh"
}
for (var key in shape) {
    if (typeof shape[key] !== "function") {
        var newShape = new Shape({
            name: key,
            shape: JSON.stringify(shape[key]),
            hash: hashes[key]
        });
        shapes.push(newShape);
    }
}

// var cow = new Creature({
//   name: 'cow',
//   size: 5,
//   vision: 3
// });
// map.creatures.push(cow);

// var basic = new Creature({
//   name: 'basic',
//   size: 2,
//   vision: 3
// });
// map.creatures.push(basic);


// var spider = new Creature({
//   name: 'spider',
//   size: 3,
//   vision: 5
// });
// map.creatures.push(spider);

function findMatch(arr, name) {
    var id;
    arr.forEach(function(elem) {
        if (elem.name === name) id = elem._id;
    })
    return id;
}

var creatures = [];

var elephant = new Creature({
    shape: findMatch(shapes, 'elephant'),
    name: 'elephant',
    category: 'large',
    size: 10,
    vision: 3
});
creatures.push(elephant);

var giraffe = new Creature({
    shape: findMatch(shapes, 'giraffe'),
    name: 'giraffe',
    category: 'large',
    size: 7,
    vision: 5
});
creatures.push(giraffe);

var fox = new Creature({
    shape: findMatch(shapes, 'fox'),
    name: 'fox',
    category: 'medium',
    isHerbivore: false,
    size: 3,
    vision: 5
});
creatures.push(fox);

var lion = new Creature({
    shape: findMatch(shapes, 'lion'),
    name: 'lion',
    category: 'large',
    isHerbivore: false,
    size: 6,
    vision: 6
});
creatures.push(lion);

var turtle = new Creature({
    shape: findMatch(shapes, 'turtle'),
    name: 'turtle',
    category: 'small',
    size: 1,
    vision: 2
});
creatures.push(turtle);

var penguin = new Creature({
    shape: findMatch(shapes, 'penguin'),
    name: 'penguin',
    category: 'small',
    size: 2,
    vision: 3
});
creatures.push(penguin);

var deer = new Creature({
    shape: findMatch(shapes, 'deer'),
    name: 'deer',
    category: 'medium',
    size: 5,
    vision: 3
});
creatures.push(deer);

var chick = new Creature({
    shape: findMatch(shapes, 'chick'),
    name: 'chick',
    category: 'small',
    size: 1,
    vision: 1
});
creatures.push(chick);

var wildDog = new Creature({
    shape: findMatch(shapes, 'wolf'),
    name: 'wolf',
    category: 'medium',
    isHerbivore: false,
    size: 3,
    vision: 5
});
creatures.push(wildDog);

var crocodile = new Creature({
    shape: findMatch(shapes, 'crocodile'),
    name: 'crocodile',
    isHerbivore: false,
    category: 'medium',
    size: 4,
    vision: 3
});
creatures.push(crocodile);

var beaver = new Creature({
    shape: findMatch(shapes, 'beaver'),
    name: 'beaver',
    category: 'small',
    size: 2,
    vision: 2
});
creatures.push(beaver);

var pigeon = new Creature({
    shape: findMatch(shapes, 'pigeon'),
    name: 'pigeon',
    category: 'small',
    size: 1,
    vision: 3
});
creatures.push(pigeon);

var duck = new Creature({
    shape: findMatch(shapes, 'duck'),
    name: 'duck',
    category: 'small',
    size: 2,
    vision: 3
});
creatures.push(duck);

var levels1 = [
    new Level({
        number: 1,
        objectives: [{
            text: 'eat grass',
            completed: false
        }, {
            text: 'eat grass 3X',
            completed: false
        }, {
            text: 'procreate',
            completed: false
        }, {
            text: 'procreate 3x',
            completed: false
        }],
        available: true,
        img: "land-icon.png"
    }),
    new Level({
        number: 2,
        objectives: [{
            text: 'eat an animal',
            completed: false
        }, {
            text: 'eat 5 animals',
            completed: false
        }, {
            text: 'procreate',
            completed: false
        }, {
            text: 'procreate 3x',
            completed: false
        }],
        available: false,
        img: "desert-icon.png"
    }),
    new Level({
        number: 3,
        available: false,
        img: "ice-icon.png"
    }),
    new Level({
        number: 4,
        available: false,
        img: "land-icon.png"
    }),
    new Level({
        number: 5,
        available: false,
        img: "desert-icon.png"
    }),
    new Level({
        number: 6,
        available: false,
        img: "ice-icon.png"
    })
];


var levels2 = [
    new Level({
        number: 1,
        objectives: [{
            text: 'eat grass',
            completed: false
        }, {
            text: 'eat grass 3X',
            completed: false
        }, {
            text: 'procreate',
            completed: false
        }, {
            text: 'procreate 3x',
            completed: false
        }],
        available: true,
        img: "land-icon.png"
    }),
    new Level({
        number: 2,
        objectives: [{
            text: 'eat an animal',
            completed: false
        }, {
            text: 'eat 5 animals',
            completed: false
        }, {
            text: 'procreate',
            completed: false
        }, {
            text: 'procreate 3x',
            completed: false
        }],
        available: false,
        img: "desert-icon.png"
    }),
    new Level({
        number: 3,
        available: false,
        img: "ice-icon.png"
    }),
    new Level({
        number: 4,
        available: false,
        img: "land-icon.png"
    }),
    new Level({
        number: 5,
        available: false,
        img: "desert-icon.png"
    }),
    new Level({
        number: 6,
        available: false,
        img: "ice-icon.png"
    })
];

var users = [
    new User({
        name: {
            first: 'Justin',
            last: 'Kim'
        },
        email: 'jkim430@gmail.com',
        password: 'cowgoesmoo',
        isAdmin: false,
        levels: levels1
    }),
    new User({
        name: {
            first: 'Charles',
            last: 'Darwin'
        },
        email: 'darwin@gmail.com',
        password: 'evolution',
        isAdmin: true,
        key: 'abc123boop',
        levels: levels2
    })
];


var models = [Shape, Creature, User, Level, Level];
var data = [shapes, creatures, users, levels1, levels2];

startDb.then(function() {
    return Promise.all(models.map(function(model) {
        return model.find().remove()
    }))
})
    .then(function() {
        return Promise.all(models.map(function(model, index) {
            return model.create(data[index]);
        }))
    })
    .then(function() {
        console.log(chalk.green('Database seeded. Goodbye!'));
        process.exit(0);
    });