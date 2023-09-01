
<?php

function getFileNames($folderNames){
    $allFileNames = [];
    foreach($folderNames as $folderName){
        if(is_dir($folderName)){
            $files = scandir($folderName);
            foreach($files as $file){
                if($file != '.' && $file != '..'){
                    $fileNameWithoutExtension = pathinfo($file, PATHINFO_FILENAME);
                    $fileNameParts = explode('_', $fileNameWithoutExtension);
                    $fileTitle = ucwords(str_replace('-', ' ', $fileNameParts[1]));
                    $filePrice = $fileNameParts[2];
                    $allFileNames[] = [$folderName, $fileTitle, $file, $filePrice];
                }
            }
        }
    }
    return $allFileNames;
}

$processedData = getFileNames(['ita', 'nig']);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>These are the names</h1>
    <div></div>
    <script>
        function getFileNames(folderNames){
            const allFileNames = [];
            for(const folderName of folderNames){
                const files = getFilesFromFolder(folderName);
                for(const fileName of files){
                    const fullFileName = `${folderName}/${fileName}`;
                    const fileWithoutExtension = fileName.replace(/\.[^.]*$/, "");
                    const fileWithoutFolderName = fileWithoutExtension.replace(folderName+"_", "");
                    const fileTitle = fileWithoutFolderName.replace(/-/g, " ");
                    allFileNames.push([folderName, fileTitle, fullFileName]);
                }
            }
            return allFileNames;
        }

        // var allNames = getFileNames(['img', 'fnt']);
        document.querySelector('div').innerHTML = '<?=json_encode($processedData)?>';
    </script>
</body>
</html>
