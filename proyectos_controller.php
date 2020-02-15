<?php
    require "proyectos.php";
    if(isset($_GET["cve_mun"]) && isset($_GET["cve_tema"]))
    {
        $clave_municipio = $_GET["cve_mun"];
        $clave_tema = $_GET["cve_tema"];
        echo Proyectos::getProyectos($clave_municipio, $clave_tema);
    }
?>