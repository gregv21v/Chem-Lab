# Loader loads all the class files into an html document
import os
import re
from bs4 import BeautifulSoup


def printDirs(directory, level):
    for f in os.listdir(directory):
        if(os.path.isfile(directory + "/" + f)):
            #print("===> File")
            print("\t" * level + f)
        else:
            #print("===> Directory")
            print("\t" * level + f)
            printDirs(directory + "/" + f, level+1)


def getDirs(directory, level):
    dirs = []
    for f in os.listdir(directory):
        if(os.path.isfile(directory + "/" + f)):
            dirs.append({"path": directory + "/" + f, "level": level})
        else:
            dirs += getDirs(directory + "/" + f, level+1)
    return dirs


def sortDirsByLevel(dirs):
    return sorted(dirs, key=lambda directory: directory["level"], reverse=True)




# inserts the script tags for the directories
# into the html document specified.
def insertIntoHTMLDocument(document, directories):
    f = open(document, "r")
    soup = BeautifulSoup(f.read(), "html.parser")
    f.close()

    last = soup.find("title")

    f.close()

    for directory in directories:
        tag = soup.new_tag("script")
        tag["src"] = directory["path"]
        last.insert_after(tag)
        last = tag

    f = open(document, "w")
    f.write(re.sub(">\n[\s]*</script>", "></script>", soup.prettify()))
    f.close()






# creates an html document with the script tags
def createScriptTags(dirs):
    f = open("tags.html", "w")

    for directory in dirs:
        f.write("<script src=\"" + directory["path"] + "\"></script>\n")

    f.close()

dirs = getDirs("js/classes", 0)
dirs = sortDirsByLevel(dirs)
insertIntoHTMLDocument("testPage.html", dirs)
insertIntoHTMLDocument("index.html", dirs)
