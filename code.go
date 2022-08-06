package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails"
)

type Folder struct {
	r     *wails.Runtime
	store *wails.Store
}

type HttpRes struct {
    response string
}

var myClient = &http.Client{Timeout: 10 * time.Second}

func getJson(url string, target interface{}) error {
    r, err := myClient.Get(url)
    if err != nil {
        return err
    }
    defer r.Body.Close()

    return json.NewDecoder(r.Body).Decode(target)
}


func findIcon(name string) (string){
	file := new(HttpRes)
    getJson("https://raw.githubusercontent.com/lks2007/explorer-desktop-app/main/langage.json", file)

    fmt.Println(file.response)

    var res map[string]interface{}
    json.Unmarshal([]byte(file.response), &res)
    
    contentType := filepath.Ext(name)
    
    result := fmt.Sprintf("%v", res[contentType])

    if result == "<nil>"{
        result = fmt.Sprintf("%v", res[name])
    }

    return result
}

func addListFolder(dir string) [][]string {
    files, err := os.ReadDir(dir)
    if err != nil {
        log.Fatal(err)
    }

    element := [][]string{}
    element = append(element, []string{"../", "<i class='fa-solid fa-folder'></i>"})

    for _, file := range files {

		if file.Type().IsDir() {
            join := file.Name()+"/"
            icon := "<i class='fa-solid fa-folder'></i>"
            element = append(element, []string{join, icon})
        }else{
            if findIcon(file.Name()) != "<nil>"{
                data := findIcon(file.Name())

                element = append(element, []string{file.Name(), data})
            }else {
                text := file.Name()
                icon := "<i class='fa-solid fa-file'></i>"
                element = append(element, []string{text, icon})
            }
        }
    }

    return element
}

// WailsInit is called when the component is being initialised
func (c *Folder) WailsInit(runtime *wails.Runtime) error {
	c.r = runtime
	c.store = runtime.Store.New("Folder", "wrong")
	return nil
}


func (c *Folder) GetFolder() [][]string{
	lists := addListFolder(".")
	
	
	c.store.Set(lists)
	return lists
}