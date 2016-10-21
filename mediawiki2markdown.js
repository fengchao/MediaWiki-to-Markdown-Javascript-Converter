//Remove interlanguage link such as [[en:Title]], [[zh-cn:Title]]
function cleanUpElement(contertedText){
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

function archwikiHandler(contertedText) {
    // convert '{{Grp|AAA}}' into link
    contertedText = contertedText.replace(/\{\{grp\|(.*?)\}\}/gi, "[$1](https://www.archlinux.org/groups/x86_64/$1)");
    
    // convert '{{Pkg|AAA}}' into link
    contertedText = contertedText.replace(/\{\{pkg\|(.*?)\}\}/gi, "[$1](https://www.archlinux.org/packages/?name=$1)");
    
    // convert '{{AUR|AAA}}' into link
    contertedText = contertedText.replace(/\{\{aur\|(.*?)\}\}/gi, "[$1](https://aur.archlinux.org/packages/$1) ([AUR](AUR.md))");
    
    // Change {{Note|...}} into quote.
    contertedText = contertedText.replace(/\{\{Note\|(.*?)\}\}/g, "> $1");

    // Change {{注意|...}} into quote.
    contertedText = contertedText.replace(/\{\{注意\|(.*?)\}\}/g, "> $1");
    
    // {{ic|code}} into `code`.
    contertedText = contertedText.replace(/\{\{ic\|(.*?)\}\}/gi, "`$1`");
    
    // {{ic|bc}} into ```code```.
    contertedText = contertedText.replace(/\{\{bc\|([\s\S]*?)\}\}/gim, "```\n$1\n```");
    
    // {{App|...}} into list.
    contertedText = contertedText.replace(/\{\{App\|(.*?)\|(.*?)\|(.*?)\|(.*?)\}\}/g, "$1 - $2\n    * 主页: $3\n    * 软件包: $4");
    
    return contertedText;
}

function convertMediawikiToMarkdown() {

    var mediawikiEl = document.getElementById('input-mediawiki');
    var contertedText = mediawikiEl.value;

    contertedText = cleanUpElement(contertedText);

    // convert "==Heading 2==" to "# Heading 2" etc.
    contertedText = contertedText.replace(/======\s*(.*)\s*======/g, "###### $1");
    contertedText = contertedText.replace(/=====\s*(.*)\s*=====/g, "##### $1");
    contertedText = contertedText.replace(/====\s*(.*)\s*====/g, "#### $1");
    contertedText = contertedText.replace(/===\s*(.*)\s*===/g, "### $1");
    contertedText = contertedText.replace(/==\s*(.*)\s*==/g, "## $1");

    
    // convert [[The page|Page text]] to {{Link|Page text}}(The page)
    contertedText = contertedText.replace(/\[\[([^\|]*?)\|([^\|]*?)\]\]/g, function(matched, str1, str2) {
            str1 = str1.replace(/\s*\(简体中文\)\s*/g, "");
            return "{{InternalLink|" + str2 + "}}(" + str1 + ")";    
        }
    );

    // convert [[The page]] to {{Link|Page text}}(The page)
    contertedText = contertedText.replace(/\[\[([^\|]*?)\]\]/g, function(matched, str1) {
            str1 = str1.replace(/\s*\(简体中文\)\s*/g, "");
            return "{{InternalLink|" + str1 + "}}(" + str1 + ")";    
        }
    );
                                          
    // convert
    // "[http://coding.smashingmagazine.com/2012/04/20/decoupling-html-from-css/ Decoupling HTML From CSS]"
    // to
    // "[Decoupling HTML From CSS](http://coding.smashingmagazine.com/2012/04/20/decoupling-html-from-css/)"
    // '[^\s]*' matches the URL, '([^\]]*)' machtes everything else till the first closing brakcet ']'
    contertedText = contertedText.replace(/\[([^\s]*)\s([^\]]*)\]/g, "[$2]($1)");

    contertedText = contertedText.replace(/\{\{InternalLink\|(.*?)\}\}/g, "[$1]");

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
    
    contertedText = archwikiHandler(contertedText);
    
    // show the converted text
    var markdownEl = document.getElementById('result-markdown');
    markdownEl.value = contertedText;
}
