**parei em parte 3 a) Web e Express**







sequenceDiagram

    participant browser

    participant server



    Note over browser: Usuário escreve uma nota e clica em "Submit"



    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new\_note\\ncom os dados do formulário (nota e data)

    activate server

    server-->>browser: HTTP 302 Redirect para /notes

    deactivate server



    Note over browser: O navegador segue o redirect para /notes



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes

    activate server

    server-->>browser: HTML document

    deactivate server



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css

    activate server

    server-->>browser: CSS file

    deactivate server



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js

    activate server

    server-->>browser: JavaScript file

    deactivate server



    Note right of browser: JS executa e faz requisição das notas em JSON



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json

    activate server

    server-->>browser: JSON com todas as notas (incluindo a nova)

    deactivate server



    Note right of browser: JS renderiza as notas na página







sequenceDiagram

    participant browser

    participant server



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa

    activate server

    server-->>browser: HTML do SPA

    deactivate server



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css

    activate server

    server-->>browser: CSS file

    deactivate server



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js

    activate server

    server-->>browser: JavaScript file

    deactivate server



    Note right of browser: O JS é executado, carrega dados via AJAX



    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json

    activate server

    server-->>browser: JSON com notas existentes

    deactivate server



    Note right of browser: JS renderiza as notas dinamicamente



    Note over browser: Usuário escreve nova nota e clica em "Save"



    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new\_note\_spa

    activate server

    server-->>browser: 200 OK

    deactivate server



    Note right of browser: JS atualiza a interface sem recarregar a página

