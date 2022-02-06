const HIJRI_DATE_REGEX = /(Muh\.|Saf\.|Rab\. I|Rab\. II|Jum\. I|Jum\. II|Raj\.|Sha\.|Ram\.|Shaw\.|Dhuʻl-Q\.|Dhuʻl-H\.) ([1-9][0-9]?), ([0-9][0-9][0-9][0-9]) AH/;
const GREGORIAN_DATE_REGEX = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec) ([1-9][0-9]?), ([0-9]+)/;
let hijriMonths = new Array("Muh.","Saf.","Rab. I","Rab. II","Jum. I",
"Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H.");
let gregorianMonths = new Array("Jan","Feb","Mar","Apr",
"May","Jun","Jul.","Aug", "Sept", "Oct", "Nov", "Dec");

chrome.storage.sync.get(["power", "conversion_type"], function(result) {
	if (result.power === "on") {
		const contents = document.querySelectorAll('p,li,span,h1,h2,h3,h4,h5,h6');
		for (const snippet of contents) {
			if (result.conversion_type === "hijri") {
				const hijri_regex = new RegExp(HIJRI_DATE_REGEX, "g");
    			let match = hijri_regex.exec(snippet.textContent);
				if (match != null) {
					snippet.textContent = snippet.textContent.replace(hijri_regex, writeGregorianDate(hijriMonths.indexOf(match[1]), parseInt(match[2]), parseInt(match[3])));
					console.log(snippet.textContent);
				}
			} else {
				const gregorian_regex = new RegExp(GREGORIAN_DATE_REGEX, "g");
    			let match = gregorian_regex.exec(snippet.textContent);
				if (match != null) {
					snippet.textContent.replace(gregorian_regex, writeHijriDate(gregorianMonths.indexOf(match[1]), parseInt(match[2]), parseInt(match[3])));
				}
			}	
		}
    }
});


function writeGregorianDate(month, day, year) {
	var gregorianDate = convertHijriToGregorian(month, day, year);
	var gregorianFormattedDate = gregorianMonths[gregorianDate[0]] + " " + gregorianDate[1]
    + ", " + gregorianDate[2];
	return gregorianFormattedDate;
}

function writeHijriDate(month, day, year) {
	var hijriDate = convertGregorianToHijri(month, day, year);
	var hijriFormattedDate = hijriMonths[hijriDate[0]] + " " + hijriDate[1]
    + ", " + hijriDate[2] + " AH";
	return hijriFormattedDate;
}

function convertGregorianToHijri(month, day, year){
	m = month+1;
	y = year;
	if(m<3) {
		y -= 1;
		m += 12;
	}

	a = Math.floor(y/100.);
	b = 2-a+Math.floor(a/4.);
	if(y<1583) b = 0;
	if(y==1582) {
		if(m>10)  b = -10;
		if(m==10) {
			b = 0;
			if(day>4) b = -10;
		}
	}

	jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;

	b = 0;
	if(jd>2299160){
		a = Math.floor((jd-1867216.25)/36524.25);
		b = 1+a-Math.floor(a/4.);
	}
	bb = jd+b+1524;
	cc = Math.floor((bb-122.1)/365.25);
	dd = Math.floor(365.25*cc);
	ee = Math.floor((bb-dd)/30.6001);
	day =(bb-dd)-Math.floor(30.6001*ee);
	month = ee-1;
	if(ee>13) {
		cc += 1;
		month = ee-13;
	}
	year = cc-4716;

	wd = ((((jd+1)%7)+7)%7)+1;

	iyear = 10631./30.;
	epochastro = 1948084;
	epochcivil = 1948085;

	shift1 = 8.01/60.;
	
	z = jd-epochastro;
	cyc = Math.floor(z/10631.);
	z = z-10631*cyc;
	j = Math.floor((z-shift1)/iyear);
	iy = 30*cyc+j;
	z = z-Math.floor(j*iyear+shift1);
	im = Math.floor((z+28.5001)/29.5);
	if(im==13) im = 12;
	id = z-Math.floor(29.5001*im-29);

	return [im-1, id, iy];
}

function convertHijriToGregorian(month, day, year) {
     let jd;    
     let i, j, k, l, r;    
     jd = parseInt((11 * year + 3) / 30) + 354 * year + 30 * month - parseInt((month - 1) / 2) + day + 1948440 - 385;    
     theDay=jd%7;    
     if (jd > 2299160) {
         l=jd+68569;
         r=parseInt((4*l)/146097);
         l=l-parseInt((146097*r+3)/4);
         i=parseInt((4000*(l+1))/1461001);
         l=l-parseInt((1461*i)/4)+31;
         j=parseInt((80*l)/2447);
         day=l-parseInt((2447*j)/80);
         l=parseInt(j/11);
         month=j+2-12*l;
         year=100*(r-49)+i+l;
     }
     else {
         j=jd+1402;
         k=parseInt((j-1)/1461);
         l=j-1461*k;
         r=parseInt((l-1)/365)-parseInt(l/1461);
         i=l-365*r+30;
         j=parseInt((80*i)/2447);
         day=i-parseInt((2447*j)/80);
         i=parseInt(j/11);
         month=j+2-12*i;
         year=4*k+r+i-4716;
     }
     return [month, day, year];
 } 
