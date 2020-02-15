<?php

define("DB_HOST", 'localhost');
define("DB_USER", 'root');
define("DB_PASSWORD", 'Mysqlexpea2018');
define("DB_NAME", 'coords');

class Proyectos {
   static private $mysqli;
   static private $municipios;
   static private $proyectos;
   static private $temas;

   static private function getConnection() {
        if(!isset(self::$mysqli)){
            self::$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
            if (self::$mysqli->connect_errno) {
                echo "Fallo al conectar a MySQL: " . self::$mysqli->connect_error;
                exit();
            }
            if (!self::$mysqli->set_charset("utf8")) {
                printf("Error cargando el conjunto de caracteres utf8: %s\n", self::$mysqli->error);
                exit();
            }
        }
        return self::$mysqli;
   }
   static public function getMunicipios() {
        if(isset(self::$municipios)){
            return self::$municipios;
        }
        self::$municipios = [];
        $mysqli = self::getConnection();
        $resultado = $mysqli->query('SELECT * FROM coords.municipio order by municipio_local;');
        while($fila = $resultado->fetch_assoc()) {
             self::$municipios[] = [
                'id' => $fila['id_municipio'],
                'name' => $fila['municipio_local'],
                'coords' => json_decode($fila['coords'])
             ];
        }

        return json_encode(self::$municipios);
    }
    
    static public function getTemas() {
        if(isset(self::$temas)){
            return self::$temas;
        }
        self::$temas = [];
        $mysqli = self::getConnection();
        $resultado = $mysqli->query('SELECT * FROM coords.temas order by nom_tema;');
        while($fila = $resultado->fetch_assoc()) {
             self::$temas[] = [
                'id' => $fila['cve_tema'],
                'name' => $fila['nom_tema'],
             ];
        }

        return json_encode(self::$temas);
    }

    public static function getProyectos($cve_mun, $cve_tema) {
        if (isset(self::$proyectos)) {
            return self::$proyectos;
        }
        self::$proyectos = [];
        $mysqli = self::getConnection();
        $cadenaSql = "";
        if($cve_tema == 0)
            $cadenaSql = "SELECT cve_reu, avance, email, coords, cve_mun, cve_tema FROM coords.tblreuniones WHERE cve_mun = '$cve_mun'";
        else
            $cadenaSql = "SELECT cve_reu, avance, email, coords, cve_mun, cve_tema FROM coords.tblreuniones WHERE cve_mun = '$cve_mun' and cve_tema = '$cve_tema'";
        $resultado = $mysqli->query($cadenaSql);
        while($fila = $resultado->fetch_assoc()) {
			$paso=$fila['avance'];
             $project = [
                'id' => intval($fila['cve_reu']),
                'email' => $fila['email'],
                'muncipio' => intval($fila['cve_mun']),
				'cve_tema' => intval($fila["cve_tema"]),
                //'description' => $fila['avance'],
				 'description' => json_encode($paso),
                'coords' => json_decode($fila['coords'])
             ];
            self::$proyectos[] = $project;
        }

        return json_encode(self::$proyectos);
    }
   
}

header("Content-type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
/*
try {
    $municipioswProject = Proyectos::getMunicipiosWithProjects();
    $result = json_encode($municipioswProject);
    echo $result;
} catch (Exception $e) {
    echo 'Excepción capturada: ',  $e->getMessage(), "\n";
}*/

