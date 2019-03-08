import Database from './util/i18n';

export const I18N = new Database();

I18N.locale = 'en';

I18N.set('en')`Dataset`
    .add('de')`Datensatz`
    .add('se')`Uppgifter`
    .add('fi')`Aineisto`;

I18N.set('en')`Variable`
    .add('de')`Variable`
    .add('se')`Variabel`
    .add('fi')`Muuttuja`;

I18N.set('en')`Places`
    .add('de')`Orte`
    .add('se')`Platser`
    .add('fi')`Paikat`;

I18N.set('en')`Place`
    .add('de')`Ort`
    .add('se')`Plats`
    .add('fi')`Paikka`;

I18N.set('en')`Time`
    .add('de')`Zeit`
    .add('se')`Tid`
    .add('fi')`Aika`;

I18N.set('en')`Multi`
    .add('de')`Multi`
    .add('se')`Multi`
    .add('fi')`Multi`;


I18N.set('en')`Something went wrong`
    .add('de')`Irgendetwas lief schief`
    .add('se')`Något gick fel`
    .add('fi')`Jotain meni pieleen`;

I18N.set('en')`Time-Series`
    .add('de')`Zeitserie`
    .add('se')`Tidsserier`
    .add('fi')`Aikasarja`;

I18N.set('en')`Values`
    .add('de')`Werte`
    .add('se')`Värden`
    .add('fi')`Aineisto`
    .add('fi')`Arvot`;

I18N.set('en')`Start`
    .add('de')`Start`
    .add('se')`Start`
    .add('fi')`Alkaa`;

I18N.set('en')`Stop`
    .add('de')`Stopp`
    .add('se')`Stanna`
    .add('fi')`Alkaa`;

I18N.set('en')`Please wait...`
    .add('de')`Bitte warten...`
    .add('se')`Vänta vänta...`
    .add('fi')`Odota...`;

I18N.set('en')`Loading data`
    .add('de')`Lade Daten`
    .add('se')`Laddar data`
    .add('fi')`Tietoja ladataan`;

I18N.set('en')`Cannot reach server`
    .add('de')`Kann Server nicht erreichen`
    .add('se')`Kan inte nå servern`
    .add('fi')`Palvelimeen ei pääse`;
