package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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


func findIcon(name string) (string){
    url := "https://raw.githubusercontent.com/lks2007/explorer-desktop-app/main/langage.json"
	meClient := http.Client{
		Timeout: time.Second * 2, // Timeout after 2 seconds
	}

	req, _ := http.NewRequest(http.MethodGet, url, nil)
	res, _ := meClient.Do(req)
	
	if res.Body != nil {
		defer res.Body.Close()
	}
	body, _ := ioutil.ReadAll(res.Body)

    var response map[string]interface{}
    json.Unmarshal([]byte(body), &response)
    
    contentType := filepath.Ext(name)
    
    result := fmt.Sprintf("%v", response[contentType])

    if result == "<nil>"{
        result = fmt.Sprintf("%v", response[name])
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