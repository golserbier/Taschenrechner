let Eingabewert = 0;    //Der Wert, der am Display angezeigt wird
let KommaWert = 0;      //Die Anzahl der Ziffern hinter dem Komma
let DisplayValue="";    //Der Text, der auf dem Display angezeigt wird.
let ZwWert=0;   //Der Zwischenwert der Berechnungen
let values=[];  //Die eingegebenen Zahlen
let operations=[];  //Die ausgeführten mathem.Operationen
    operations[0]=0;
let i=0;    //Die Stelle, in die der eingegebene wert gespeichert wird
let MalProdukt = 1; //Das Zwischenprodukt bei Multiplikationen/Divisionen
let a=0; //Zwischenwert
let ergebnis = 0   //gibt an, ob schon fertig gerechnet wurde
let last_result = 0;

//Funktion für die Eingabe am Numpad
function zahl_eingabe(wert)
{
    checkErgebnis();
    Eingabewert *= 10;  //Verschiebt alle Ziffern um eine Stelle nach links
    if(KommaWert!=0) {  //Wenn die Zahl ein Komma hat
        Eingabewert *= KommaWert; /*Verschiebt alle Ziffern um die Anzahl der 
        Kommastellen nach links, damit neue Ziffern hinzugefügt werden können*/
        KommaWert *= 10;   //Erhöht die Ziffern hinter dem Komma
    }
    Eingabewert += wert;
    //Ziffern hinter das Komma verschieben
    if(KommaWert!=0) Eingabewert /= KommaWert; 
    //für Display-Anzeige
    Display(wert);
}
function Komma()    //Funktion für das Komma
{
    if(KommaWert!=0) {
        alert('Error: Komma kann nicht zweimal eingegeben werden');
    }
    else {
        KommaWert=1;
        Display(',')
    }
}
function checkErgebnis()    //bei neuer Rechnung die Alte löschen
{
    if(ergebnis == 1) {
        Clear_all();
        ergebnis = 0;
    }
}
function enter_Answer()     //Ergebnis der Letzten Rechnung eingeben (Ans)
{
    checkErgebnis();
    if (Eingabewert == 0) Eingabewert = last_result;    /* Eingabewert auf Wert
    der letzten Rechnung setzen*/
    else Eingabewert *= last_result;                    /*Eingabewert 
    multiplizieren, falls bereits Wert eingegeben wurde*/
    Display('Ans'); //Display Anzeige
}
//Display
function Display(newvalue)          //Funktion aktualisiert die Display-Anzeige
{
    DisplayValue += newvalue;
    document.getElementById("Display_calculations").innerHTML = DisplayValue;
}
function Display_remove_Eingabe()   //Entfernt die letzte eingegebene Zahl
{
    //Ermittelt die Länge der eingegebenen Zahl
    let b=Eingabewert;
    for(ii=0; b>=1; ii++) {
        b /= 10;
    }
    let length = DisplayValue.length;   //ermittelt Länge des Display-text
    //Die letzte Eingabe entfernen
    DisplayValue=DisplayValue.slice(0, length-ii);
    //Anzeige aktualisieren
    Display('');
}
//Löschen
function Clear_all()        //alles löschen
{
    Clear_variables();
    Clear_display();
}
function Clear_variables()  //Variabeln löschen
{
    Eingabewert=0;
    KommaWert=0;
    i=0;
    ZwWert=0;
    MalProdukt=1;
    a=0;
    ergebnis=0;
}
function Clear_display()    //Display zurücksetzen
{
    document.getElementById("Display_result").innerHTML = '';
    DisplayValue="";
    Display('');
}
//Endergebnis
function Enter()
{
    math();
    for(let x=1; x<=i; x++)
    {
        //nur Hilfestellung zum debuggen
        /*'alert('x =' + x +'\n operations[x-1]= ' + operations[x-1] + '\
        \n values[x]=' + values[x] + '\n ZwWert =' + ZwWert);*/
        switch(operations[x-1])
        {
            case 0:
                ZwWert = values[x];
                break;
            case 1:
                ZwWert += values[x];
                break;
            case 2:
                ZwWert -= values[x];
                break;
            case 3:
                ZwWert_anpassen(calc_mal_dividiert(x),x);
                break;
            case 4:
                ZwWert_anpassen(calc_mal_dividiert(x),x);
                break;
            case 5: //Potenzieren
                ZwWert_anpassen(Math.pow(values[x-1], values[x]),x);
                /*1.Funktionswert: Die Potenz mit dem letzten Wert hoch dem
                aktuellen Wert
                2. Funktionswert: die aktuelle Stelle im Programm (x) */
                break;
            default:
                alert('Error: Enter()-switch-default');
                break;
        }
    }
    document.getElementById("Display_result").innerHTML = ZwWert;
    ergebnis=1; //um Display bei neuer Eingabe zu löschen
    last_result = ZwWert;   //Speichert Ergebnis der Rechnung.
}
function round()    //Runden
{
    if(document.getElementById('Display_result')==''){
        Enter();
    }
    document.getElementById("Display_result").innerHTML = Math.round(ZwWert);
}
//Funktionen zum Endergebnis ausrechnen
function calc_mal_dividiert(x)      //führt die Multiplikation/Division aus
{
    MalProdukt=values[x-1];         //Das erste Faktor/Dividend
    for(let ii=0; 1; ii++)
    {   
        /*Den Wert im value-Speicher an der Stelle x+ii
        (Stelle um 1 mehr als operations[] in if-condition) multiplizieren*/
        if(operations[(x+ii-1)]==3) MalProdukt *= values[(x+ii)];   
        if(operations[(x+ii-1)]==4) MalProdukt /= values[(x+ii)];
        //Wenn nächste Rechnung nicht Mal/Dividiert ist, abbrechen
        if(operations[(x+ii-1)]!=3&&operations[(x+ii-1)]!=4) return MalProdukt;
    }   
}
function ZwWert_anpassen(a,x)   //ändert ZwWert bei Punktrechnungen
{   //a ist der Wert, der hinzugefügt wird, x die Aktuelle Stelle in Enter()
    //a ist das Ergebnis der Multiplikation/Division
    switch (operations[x-2]) {
        case 0:                 //für die erste Rechnung
            ZwWert = a;
            return;
        case 1:                 //Vorherige Rechnung war Addieren
            ZwWert -= values[x-1];  //letzte Rechnung rückgängig machen
            ZwWert += a;
            return;            //ZwWert += Rechnungsergebnis
        case 2:                 //vorherige Rechnung war Subtrahieren
            ZwWert += values[x-1];
            ZwWert -= a;            //ZwWert -= Rechnungsergebnis
            return;
        case 3:
            ZwWert *= a;
            return;
        case 4: 
            ZwWert /= a;
            return;
        default:
            alert('Error: ZwWert_anpassen()-switch');
            return;
    }
    
}
//Funktionen für spezielle Werte
function enter_PI()
{    //für Pi
    checkErgebnis();
    if(Eingabewert != 0) {  //Wenn bereits eingegeben wurde
        Eingabewert *= Math.PI; //Eingabe mit Pi multiplizieren
    }
    else{
        Eingabewert=Math.PI; //Eingabe auf Pi setzen
    }
    Display('π');
}
function enter_e()
{
    checkErgebnis();
    if(Eingabewert != 0) {  //Wenn bereits eingegeben wurde
        Eingabewert *= Math.E; //Eingabe mit e multiplizieren
    }
    else{
        Eingabewert=Math.E; //Eingabe auf e setzen
    }
    Display('e');
}
//einfache mathem. Operationen (speichern im value[] und operations[] Speicher) 
function math() //speichert die akuelle Zahl im value[] Speicher
{
    i++;
    values[i]=Eingabewert;
    Eingabewert=0;
    KommaWert=0;
}
function addieren()
{
    math();
    operations[i]=1;
    //Anzeige
    Display('+');
}
function subtrahieren()
{
    math();
    operations[i]=2;
    //Anzeige
    Display('-');
}
function multiplizieren()
{
    math();
    operations[i]=3;
    //Anzeige
    Display('x');
}
function dividieren()
{
    math();
    operations[i]=4;
    //Anzeige
    Display('/');
}
//komplizierte mathem. Operationen
function potenzieren(x)     //Potenzieren (nur hoch 2 oder 3)
{
    checkErgebnis();
    if(Eingabewert==0) Display('0');
    if(x==2||x==3)    //Zum Potenzieren mit 2 oder 3
    {
        Eingabewert = Math.pow( Eingabewert, x);
        //Anzeige am Display
        if(x==2) {
            Display('²');
        }
        else if (x==3) {
            Display('³');
        }
        return;
    }
    //Für andere Werte als 2 oder 3
    math();
    operations[i]=5;
    Display('^');   //Anzeige
}
function winkelfunktion(x)  //Eingabe von Winkelfunktionen
{
    checkErgebnis();
    Display_remove_Eingabe();   //Eingabewert vom Display entfernen
    a = Eingabewert * Math.PI / 180;
    //Anzeige
    switch (x){
        case 1:
            Display('sin ' + Eingabewert + '° ');
            Eingabewert = Math.sin(a);
            break;
        case 2:
            Display('cos ' + Eingabewert + '° ');
            Eingabewert = Math.cos(a);
            break;
        case 3:
            Display('tan ' + Eingabewert + '° ');
            Eingabewert = Math.sin(a) / Math.cos(a);
            break;
        default:
            alert('Error: winkelfunktion()-switch-default');
            break;
    }
}
function wurzel()           //Eingabe und berechnen von Wurzeln
{
    checkErgebnis();
    Display_remove_Eingabe();   //Die letzte Zahl entfernen
    
    Display('√('+Eingabewert+')');  //Wurzel am Display anzeigen
    Eingabewert=Math.sqrt(Eingabewert); //Wurzel vom Eingabewert machen
}
function Ln()
{
    checkErgebnis();
    Display_remove_Eingabe();   //Die letzte Zahl entfernen
    
    Display('ln ('+Eingabewert+')');  //ln am Display anzeigen
    Eingabewert=Math.log(Eingabewert); //ln vom Eingabewert machen
}
function log()
{
    checkErgebnis();
    Display_remove_Eingabe();   //Die letzte Zahl entfernen
    
    Display('log ('+Eingabewert+')');   //log am Display anzeigen
    Eingabewert=Math.log10(Eingabewert); //log vom Eingabewert machen
}
//Tastatur
function tastatur_eingabe()
{
    let key = event.key;
    /*Überprüfen, ob gedrückte Taste eine Zahl ist
    parseInt, weil Tastatureingabe ein String ist*/
    if(parseInt(key)>=0 || parseInt(key)<=9) {
        zahl_eingabe(parseInt(key,10));
        return;
    }
    //Überprüft die Eingabe, falls es keine Zahl ist
    switch (key) {
        case ',':
            Komma();
            return;
        case '+':
            addieren();
            return;
        case '-':
            subtrahieren();
            return;
        case 'x':
            multiplizieren();
            return;
        case 'd':
            dividieren();
            return;
        case 'Enter':
            Enter();
            return;
        case 'Delete':
            Clear_all();
            return;
        case 'a':
            enter_Answer();
            return;
        case 's':
            winkelfunktion(1);
            return;
        case 'c':
            winkelfunktion(2);
            return;
        case 't':
            winkelfunktion(3);
            return;
        case 'p':
            enter_PI();
            return;
        case 'e':
            enter_e();
            return;
        case 'r':
            round();
            return;
        case 'w':
            wurzel();
            return;
        case '^':
            potenzieren('x');
            return;
        default:
            document.getElementById('Error').innerHTML = 'falsche Eingabe. \
            Bitte Tutorial für Hilfe ansehen.';
            document.getElementById('Error').style.visibility = visible;
            return;
    }
}
