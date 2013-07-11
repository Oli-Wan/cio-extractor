var fs = require('fs'),
    Iconv = require('iconv').Iconv,
    fieldSeparator = "|";

exports.load = function () {
    var files = []
    var path = "cio-data/";
    files.fiches = parseFile(path + "FICHE.txt");
    files.specialites = parseFile(path + "SPECIALITE.txt");
    files.compositions = parseFile(path + "COMPOSITION.txt");
    files.composants = parseFile(path + "COMPOSANT.txt");
    files.equivalences = parseFile(path + "EQUIVALENCE.txt");
    files.vqr = parseFile(path + "VQR.txt");
    files.formes = parseFile(path + "FORME.txt");
    files.voies = parseFile(path + "VOIE.txt");
    files.libelleStructure = parseFile(path + "LBL_STRUCT.txt");

    var dictionnaries = []
    dictionnaries.dico_unites = createDictonnary(path + "DICO_UNITE.txt");
    dictionnaries.dico_composants = createDictonnary(path + "DICO_COMPOSANT.txt");
    dictionnaries.dico_forme = createDictonnary(path + "DICO_FORME.txt");
    dictionnaries.dico_voie = createDictonnary(path + "DICO_VOIE.txt");
    dictionnaries.table_abrege = createDictonnary(path + "TBL_ABREGES.txt");
    dictionnaries.table_cinetique = createDictonnary(path + "TBL_CINETIQUE.txt");
    dictionnaries.table_ssx = createDictonnary(path + "TBL_SSX.txt");
    dictionnaries.table_terrain = createDictonnary(path + "TBL_TERRAIN.txt");
    dictionnaries.table_forme = createDictonnary(path + "TBL_FORME.txt");
    dictionnaries.table_voie = createDictonnary(path + "TBL_VOIE.txt");
    dictionnaries.table_u_qte = createDictonnary(path + "TBL_U_QTE.txt");
    dictionnaries.table_age = createDictonnary(path + "TBL_AGE.txt");
    dictionnaries.table_marque_nom = createDictonnary(path + "TBL_MARQUE_NOM.txt");
    dictionnaries.table_contenant = createDictonnary(path + "TBL_CONTENANT.txt");
    dictionnaries.table_u_pres = createDictonnary(path + "TBL_U_PRES.txt");
    dictionnaries.table_marque_cont = createDictonnary(path + "TBL_MARQUE_CONT.txt");
    dictionnaries.table_dispositif = createDictonnary(path + "TBL_DISPOSITIF.txt");
    dictionnaries.table_marque_disp = createDictonnary(path + "TBL_MARQUE_DISP.txt");

    return {
        data: files,
        dictionnaries: dictionnaries
    };
};

function parseFile(fileName) {
    var file = fs.readFileSync(fileName);
    var iconv = new Iconv("ISO-8859-1", 'UTF-8');
    var buffer = iconv.convert(file);
    data = buffer.toString('utf8');
    var contents = [];
    var lineArray = data.split("\r\n");
    lineArray.forEach(function (line) {
        if(line.length == 0)
            return;

        var recordArray = line.split(fieldSeparator);
        if (recordArray)
            contents.push(recordArray);
    });
    return contents;
}

function createDictonnary(fileName) {
    var values = parseFile(fileName);
    var dico = [];
    values.forEach(function (value) {
        var key = value.splice(0, 1);
        dico[key] = value;
    });
    return dico;
}
