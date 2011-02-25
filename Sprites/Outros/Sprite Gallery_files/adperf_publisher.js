/*
 * AdPerf Publisher - Weborama.com
 * Last update : 2011-02-15
 */

var _ap_ad       = new Object;

_ap_ad.poolThread = true;
_ap_ad.poolLock  = false;
_ap_ad.poolData  = new Array();
_ap_ad.poolIsFirstReq = true;

/*** check defined ***/
_ap_ad.is_defined = function(name) {
    return ( typeof(window[name]) == "undefined" ) ? false : true;
}

/*** is true ***/
_ap_ad.is_true = function(name) {
  return _ap_ad.is_defined(name) && window[name] == 1;
}

/*** convert array into string for dyn keys ***/
_ap_ad.array_to_str = function(arr) {
  var r="";
  if (arr instanceof Array) {
    for(var i=0; i < arr.length; i++) {
      var data = arr[i];
      if (data instanceof Array && data.length == 2) {
        r += escape(data[0])+":"+escape(data[1])+",";
      }
    }
  }
  return r.length > 0 ? r.substr(0,r.length-1) : null
}

/*** display a static img ***/
_ap_ad.aff = function(n, l, h) {
  if (typeof l == 'undefined') l=1; if (typeof h == 'undefined') h=1;
  document.write('<img src="http://astatic.weborama.fr/transp.gif" width='+l+' height='+h+'/>');
}
/*** indique si une pub est dispo pour un emplacement ***/
_ap_ad.has = function(n) {
  return false;
}
/*** indique la taille d'un emplacement ***/
_ap_ad.size = function(n) {
  return [1,1];
}
/*** count a diffcount ***/
_ap_ad.poolCount = function() {
  if (_ap_ad.poolLock) { return; }
  if (_ap_ad.poolData.length <= 0) { return; }

  var w_ic = new Image();
  var url = _ap_ad.poolData.shift();

  _ap_ad.poolLock = ! _ap_ad.poolThread;

  var fct = function(e) {
    _ap_ad.poolLock = false;
    _ap_ad.poolCount();
  };
  
  w_ic.onload = fct;
  w_ic.onerror = fct;

  w_ic.src = url;
}

/*** pool a diffcount ***/
_ap_ad.pool = function(url) {
  var urlAdd = "";
  if (_ap_ad.poolIsFirstReq) {
    _ap_ad.poolIsFirstReq = false;
    urlAdd="&ireq=1";
  }
  _ap_ad.poolData.push(url+urlAdd);
  _ap_ad.poolCount();
}

/*** write a pub ***/
_ap_ad.write = function(src) {
    document.write('<scr'+'ipt src="'+src+'"></SCR'+'IPT>');
}

/*** place a pub ***/
_ap_ad.place = function(n) {
  var place = document.getElementById("wbo_adp_place_"+n);
  var elm = document.getElementById("wbo_adp_emp_"+n);
  if (elm != undefined && place != undefined) { 
    elm = elm.parentNode.removeChild(elm);
    elm.style.display=place.style.display;
    place.parentNode.replaceChild(elm,place); 
  }
}

/*** create an iframe ***/
_ap_ad.create_iframe = function(t,n,l,h) {
  var style = "";
  if (t == "emp") {
    style = "display: none";
  }
  document.write("<iframe id=\"wbo_adp_"+t+"_"+n+"\" name=\"wbo_adp_"+t+"_"+n+"\" frameborder=0 scrolling=\"no\" vspace=0 hspace=0 width=\""+l+"px\" height=\""+h+"px\" margin=0 marginwidth=0 marginheight=0 border=0 allowtransparency=\"true\" src=\"about:blank\" style=\""+style+"\"><\/iframe>");
}

/*** set widpub css ***/
_ap_ad.setCSS = function() {
  css = "<style type=\"text/css\">\n" + 
        "widpub {\n" + 
        "    z-index: 999990;\n" + 
        "    position: relative;\n" +
        "}\n" + 
        "widpub.inter {\n" + 
        "    z-index: 999995;\n" + 
        "}\n" + 
         "widpub.slide {\n" + 
        "    z-index: 999995;\n" + 
        "}\n" + 
        "widpub.floor {\n" + 
        "    z-index: 999996;\n" + 
        "}\n" + 
        "widpub.wintext {\n" + 
        "    z-index: 999991;\n" + 
        "}\n" + 
        "widpub.prehome {\n" + 
        "    z-index: 999999;\n" + 
        "}\n" + 
        "</style>\n";
  document.write(css);
}

/*** ALIAS ***/
var wr_get_and_display_pub = function() {
  _ap_ad.write(_ap_script);
}

var wr_aff_pub = function(n, l, h) {
  _ap_ad.aff(n, l, h);
}

var wr_has_pub = function(n) {
  return _ap_ad.has(n);
}

var wr_size_pub = function(n) {
  return _ap_ad.size(n);
}


/*** Construction appel ***/
var wr_secure    = '';
var wr_solutions = 'solution.weborama.fr/fcgi-bin/diff.fcgi?';
if (_ap_ad.is_true('wr_aod')) {
  /*** le mode AOD deporte le capping ***/
  /*** on desactive alors le mode thread pour la pool de comptage ***/
  _ap_ad.poolThread = false;
}

_ap_ad.host        = ( _ap_ad.is_defined('wr_host') )        ? wr_host : 'aimfar';
_ap_ad.board       = ( _ap_ad.is_defined('wr_board') )       ? 'ide='+wr_board : null;
_ap_ad.boardsize   = ( _ap_ad.is_defined('wr_boardsize') )   ? 'emp='+wr_boardsize : 'emp=1x1';
_ap_ad.autopage    = ( _ap_ad.is_defined('wr_detail') )      ? 'kp='+wr_detail : null;
_ap_ad.floating    = ( _ap_ad.is_defined('wr_floating') )    ? 'floating='+wr_floating : 'floating=0';
_ap_ad.site        = ( _ap_ad.is_defined('wr_site') )        ? 'ids='+wr_site : null;
_ap_ad.page        = ( _ap_ad.is_defined('wr_page') )        ? 'pageid='+wr_page : null;
_ap_ad.extparams   = ( _ap_ad.is_defined('wr_extparams') )   ? 'ext_params='+escape(wr_extparams) : null;
_ap_ad.crealist    = ( _ap_ad.is_defined('wr_crealist') )    ? 'cl='+wr_crealist : null;
_ap_ad.advlist     = ( _ap_ad.is_defined('wr_advlist') )     ? 'al='+wr_advlist: null;
_ap_ad.camplist    = ( _ap_ad.is_defined('wr_camplist') )    ? 'cal='+wr_camplist : null;
_ap_ad.model       = ( _ap_ad.is_defined('wr_model') )       ? 'model='+wr_model : null;
_ap_ad.thema       = ( _ap_ad.is_defined('wr_thema') )       ? 'wthema='+wr_thema : null;
_ap_ad.click       = ( _ap_ad.is_defined('wr_click') )       ? 'ext_click='+escape(wr_click) : null;
_ap_ad.display     = ( _ap_ad.is_defined('wr_display') )     ? 'ext_display='+escape(wr_display) : null;
_ap_ad.ex_secteurs = ( _ap_ad.is_defined('wr_ex_secteurs' )) ? 'nsa='+escape(wr_ex_secteurs) : null;
_ap_ad.backup 	   = ( _ap_ad.is_defined('wr_backup' )) 	   ? 'bak='+escape(wr_backup) : null;
_ap_ad.mask 	   = ( _ap_ad.is_defined('wr_mask' )) 	   ? 'mask='+wr_mask : null;
_ap_ad.light 	   = ( _ap_ad.is_defined('wr_light' )) 	   ? 'light='+wr_light : null;
_ap_ad.dynkeys     = ( _ap_ad.is_defined('wr_dynamic_keys')) ? 'dynkeys='+_ap_ad.array_to_str(wr_dynamic_keys) : null;
_ap_ad.autofit     = ( _ap_ad.is_defined('wr_autofit') )     ? 'auf='+wr_autofit : null;
_ap_ad.cache 	     = ( _ap_ad.is_defined('wr_cache' )) 	     ? 'cache='+wr_cache : null;
_ap_ad.aod         = ( _ap_ad.is_true('wr_aod') )            ? '&aod=1':null;
_ap_ad.ref		     = null;
_ap_ad.url		     = null;
try {
	_ap_ad.url='url='+escape(document.location);
	var ref = (top!=null && top.location!=null && typeof(top.location.href)=="string")?top.document.referrer:document.referrer;
	_ap_ad.ref='ref='+escape(ref);	
} catch (e) {}

_ap_adlist       = [ 'site', 'page', 'boardsize', 'autopage', 'board', 'crealist',
                     'advlist', 'camplist', 'model', 'thema', 'floating', 'extparams', 'ref', 'url', 'click', 'display',
                     'ex_secteurs', 'backup', 'cache', 'dynkeys', 'autofit', 'aod', 'mask', 'light'
                   ];
var _ap_script   = 'http' + wr_secure + '://' + _ap_ad.host + '.' + wr_solutions;
var _ap_first    = true;


for ( var k in _ap_adlist ) {
    var key = _ap_adlist[k];
    if ( 'undefined' != typeof(_ap_ad[key]) && _ap_ad[key] != null ) {
        _ap_script += (_ap_first ? '' : '&') + _ap_ad[key];
        _ap_first = false;
    }
}

// on fait un appel direct
if (_ap_ad.board !== null) {
	_ap_ad.write(_ap_script);
}
