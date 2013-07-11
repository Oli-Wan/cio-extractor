var dictionnaries;

exports.extract = function (data, dico) {
    dictionnaries = dico;
    var fiches = [];
    fiches = apply(fiches, data.fiches, extractFiches);
    fiches = apply(fiches, data.specialites, extractNonCommercial);
    fiches = apply(fiches, data.compositions, extractComposition);
    fiches = apply(fiches, data.composants, extractComposant);
    fiches = apply(fiches, data.equivalences, extractEquivalence);
    fiches = apply(fiches, data.vqr, extractVqr);
    fiches = apply(fiches, data.formes, extractForme);
    fiches = apply(fiches, data.voies, extractVoie);
    fiches = apply(fiches, data.libelleStructure, extractLibelleStructure);
    return fiches;
};

function apply(documents, records, f) {
    records.forEach(function (line) {
        var document = documents[line[0]];
        var result = f(line, document);
        documents[result.ucd] = result;
    });
    return documents;
}

function extractFiches(line) {
    var fiche = {
        ucd: line[0],
        ucd13: line[4],
        composants: {},
        vqr: []
    };
    return fiche;
}

function extractNonCommercial(line, fiche) {
    fiche.nomCommercial = line[3];
    return fiche;
}

function extractComposition(line, fiche) {
    var codeComposant = line[1];
    fiche.composants[codeComposant] = {
        est_solvant: line[4] == 1,
        libelle: dictionnaries.dico_composants[codeComposant][2],
        est_dci: dictionnaries.dico_composants[codeComposant][3] == 1
    };
    return fiche;
}

function extractComposant(line, fiche) {
    var codeComposant = line[1];
    var composant = fiche.composants[codeComposant];
    composant.quantite = line[5];
    composant.unite = line[2];
    return fiche;
}

function extractEquivalence(line, fiche) {
    var codeComposant = line[1];
    var composant = fiche.composants[codeComposant];

    var composantEq = line[2];

    composant.equivalence = {
        libelle: dictionnaries.dico_composants[composantEq][2],
        est_dci: dictionnaries.dico_composants[composantEq][3] == 1,
        unite: line[3],
        quantite: line[6]
    };
    return fiche;
}
function extractVqr(line, fiche) {
    fiche.vqr.push({
        "quantite": line[4],
        "unite": line[1],
        "reconstitue": line[5] == 1,
        "estime": line[7] == 1
    });
    return fiche;
}
function extractForme(line, fiche) {
    var codeForme = line[1];
    return extractNameAndShortcut(fiche, "forme", codeForme, dictionnaries.dico_forme);
}

function extractVoie(line, fiche) {
    var codeVoie = line[1];
    return extractNameAndShortcut(fiche, "voie", codeVoie, dictionnaries.dico_voie);
}

function extractNameAndShortcut(fiche, key, code, dictionnary) {
    fiche[key] = {
        complet: dictionnary[code][2],
        abbreviation: dictionnary[code][3]
    };
    return fiche;
}

function extractLibelleStructure(line, fiche) {
    var libelle = {
        complement: line[6],
        reference: line[26]
    };

    libelle.nom = {};
    libelle.nom.valeur = line[4];
    if (line[5] == 1) {
        libelle.nom.abrege = true;
        libelle.nom.complet = dictionnaries.table_abrege[libelle.nom.valeur][2];
    } else {
        libelle.nom.abrege = false;
        libelle.nom.complet = libelle.nom.valeur;
    }

    libelle = extractAbregeAndComplet(dictionnaries.table_cinetique, libelle, "cinetique", line[7]);
    if (libelle.forme) {
        libelle.forme.est_vol_ref = dictionnaries.table_forme[5] == 1;
    }


    libelle.quantite = {
        a: extractQuantite(line, 8),
        b: extractQuantite(line, 17)
    }

    libelle = extractAbregeAndComplet(dictionnaries.table_ssx, libelle, "ssx", line[27]);
    libelle = extractAbregeAndComplet(dictionnaries.table_marque_nom, libelle, "marque", line[28]);
    libelle = extractAbregeAndComplet(dictionnaries.table_age, libelle, "age", line[29]);
    libelle = extractAbregeAndComplet(dictionnaries.table_terrain, libelle, "terrain", line[30]);
    libelle = extractAbregeAndComplet(dictionnaries.table_forme, libelle, "forme", line[31]);
    libelle = extractAbregeAndComplet(dictionnaries.table_voie, libelle, "voie", line[32]);

    libelle.presentation = {
        a: extractPresentation(line, 33),
        b: extractPresentation(line, 38)
    }

    libelle = extractDispositif(line, libelle);

    fiche.libelle = libelle;
    return fiche;
}


function extractDispositif(line, libelle) {
    var dispositif = {};
    dispositif = extractAbregeAndComplet(dictionnaries.table_dispositif, dispositif, "description", line[43]);
    dispositif = extractValueAndUnity(line, 44, dispositif);
    dispositif = extractAbregeAndComplet(dictionnaries.table_marque_disp, dispositif, "marque", line[46]);
    libelle.dispositif = dispositif;
    return libelle;
}

function extractPresentation(line, index) {
    var obj = {
        nombre_unite: line[index]
    }

    obj = extractAbregeAndComplet(dictionnaries.table_contenant, obj, "contenant", line[index + 1]);
    obj = extractValueAndUnity(line, index + 2, obj);
    obj = extractAbregeAndComplet(dictionnaries.table_marque_cont, obj, "marque", line[index + 4]);

    return obj;
}

function extractQuantite(line, index) {

    var obj = {
        type: line[index],
        valeurs: []
    };

    obj.valeurs.push(extractValueAndUnity(line, index + 1));
    obj.valeurs.push(extractValueAndUnity(line, index + 3));
    obj.valeurs.push(extractValueAndUnity(line, index + 5));
    obj.reference = extractValueAndUnity(line, index + 7);

    return obj;
}

function extractValueAndUnity(line, index, obj) {
    if (!obj)
        obj = {};

    if (line[index].length > 0)
        obj.quantite = line[index];

    if (line[index + 1].length > 0) {
        var value = dictionnaries.table_u_qte[line[index + 1]];
        obj.unite = value ? value[2] : line[index + 1]; // inconsistent data guard
    }
    return obj;
}

function extractAbregeAndComplet(dico, obj, property, code) {
    if (code) {
        obj[property] = {
            abrege: dico[code][2],
            complet: dico[code][3]
        }
    }
    return obj;
}

