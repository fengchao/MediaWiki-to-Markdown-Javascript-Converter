// Inner items should be converted first. 
// For example, {{ic|}} should be converted earlyer than {{Note|}}


//Remove interlanguage link such as [[en:Title]], [[zh-cn:Title]]
var cleanUpElement = function cleanUpElement(contertedText){
    contertedText = contertedText.replace(/\[\[([^:]*?):([^:]*?)\]\]\n/g, function(matched, str1, str2) {
            // Keep [[Wikipedia:XXX]]
            if (str1 == "Wikipedia")
                return matched;
            else
                return "";
        }
    );
    contertedText = contertedText.replace(/\{\{Related(.*?)\}\}\n/gi, "");
    contertedText = contertedText.replace(/\{\{Translation(.*?)\}\}\n/gi, "");
    return contertedText;
}

var archwikiHandler = function archwikiHandler(contertedText) {
    // convert '{{Grp|AAA}}' into link
    contertedText = contertedText.replace(/\{\{grp\|(.*?)\}\}/gi, "{{LinkText+$1}}(https://www.archlinux.org/groups/x86_64/$1)");
    
    // convert '{{Pkg|AAA}}' into link
    contertedText = contertedText.replace(/\{\{pkg\|(.*?)\}\}/gi, "{{LinkText+$1}}(https://www.archlinux.org/packages/?name=$1)");
    
    // convert '{{AUR|AAA}}' into link
    contertedText = contertedText.replace(/\{\{aur\|(.*?)\}\}/gi, "{{LinkText+$1}}(https://aur.archlinux.org/packages/$1) ({{LinkText+AUR}}(AUR.md))");
    
    // {{ic|code}} into `code`.
    contertedText = contertedText.replace(/\{\{ic\|(.*?)\}\}/gi, "`$1`");
    
    // {{ic|bc}} into ```code```.
    contertedText = contertedText.replace(/\{\{bc\|([\s\S]*?)\}\}/gim, "```\n$1\n```");
    
    // {{App|...}} into list.
    contertedText = contertedText.replace(/\{\{App\|(.*?)\|(.*?)\|(.*?)\|(.*?)\}\}/g, "$1 - $2\n    * 主页: $3\n    * 软件包: $4");
    
    // Change {{Note|...}} into quote.
    contertedText = contertedText.replace(/\{\{Note\|(.*?)\}\}/g, "> $1");

    // Change {{注意|...}} into quote.
    contertedText = contertedText.replace(/\{\{注意\|(.*?)\}\}/g, "> $1");

    contertedText = contertedText.replace(/\&\#61\;/gi, "=");
    
    contertedText = contertedText.replace(/<nowiki>/gi, "");
    
    contertedText = contertedText.replace(/<\/nowiki>/gi, "");
    
    return contertedText;
}

var convertMediawikiToMarkdown = function convertMediawikiToMarkdown() {

    var mediawikiEl = document.getElementById('input-mediawiki');
    var contertedText = mediawikiEl.value;

    contertedText = cleanUpElement(contertedText);
    
    contertedText = archwikiHandler(contertedText);

    // convert "==Heading 2==" to "# Heading 2" etc.
    contertedText = contertedText.replace(/======\s*(.*)\s*======/g, "###### $1");
    contertedText = contertedText.replace(/=====\s*(.*)\s*=====/g, "##### $1");
    contertedText = contertedText.replace(/====\s*(.*)\s*====/g, "#### $1");
    contertedText = contertedText.replace(/===\s*(.*)\s*===/g, "### $1");
    contertedText = contertedText.replace(/==\s*(.*)\s*==/g, "## $1");
    
    // convert [[The page]] to {{Link+The page}}(The page)
    contertedText = contertedText.replace(/\[\[([^\|]*?)\]\]/g, function(matched, str1) {
            str1 = str1.replace(/\s*\(简体中文\)\s*/g, "");
            return "{{LinkText+" + str1 + "}}(" + str1 + ")";    
        }
    );
    
    // convert [[The page|Page text]] to {{Link+Page text}}(The page)
    contertedText = contertedText.replace(/\[\[([^\|]*?)\|([^\|]*?)\]\]/g, function(matched, str1, str2) {
            str1 = str1.replace(/\s*\(简体中文\)\s*/g, "");
            return "{{LinkText+" + str2 + "}}(" + str1 + ")";    
        }
    );
    
    // convert [the_url] to {{LinkText+\*}}
    contertedText = contertedText.replace(/\[([^\s]*?)\]/g, "{{LinkText+\\*}}($1)");
                                          
    // convert
    // "[http://coding.smashingmagazine.com/2012/04/20/decoupling-html-from-css/ Decoupling HTML From CSS]"
    // to
    // "[Decoupling HTML From CSS](http://coding.smashingmagazine.com/2012/04/20/decoupling-html-from-css/)"
    // '[^\s]*' matches the URL, '([^\]]*)' machtes everything else till the first closing brakcet ']'
    contertedText = contertedText.replace(/\[([^\s]*?)\s([^\]]*?)\]/g, "{{LinkText+$2}}($1)");
    
    contertedText = contertedText.replace(/\{\{LinkText\+(.*?)\}\}/g, "[$1]");

    //convert Wikipedia link.
    contertedText = contertedText.replace(/\(Wikipedia:([^:]*?)\)/g, function(matched, str1){
            str1 = str1.replace(/\s/g, "_");
            return '(https://en.wikipedia.org/wiki/' + str1 + ')';
        }
    );
    
    // convert '**' into '    *'
    contertedText = contertedText.replace(/\*\*/g, "    *");
    
    // convert ''' into **
    contertedText = contertedText.replace(/'''/g, "**");
    
    // convert '' into __
    contertedText = contertedText.replace(/''/g, "__");
    
    // show the converted text
    var markdownEl = document.getElementById('result-markdown');
    markdownEl.value = contertedText;
}
