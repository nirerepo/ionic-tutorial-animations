import groovy.json.*
import groovyx.net.http.*
import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*


def cli = new CliBuilder(usage: "CargadorDatos <options> <mesasge>", header: "\nAvailable options:\n")
cli.with {
    t longOpt: 'token', args: 1, 'Token del dispositivo', required: true
    m longOpt: 'message', args: 1, 'Mensaje del push', required: true
    a longOpt: 'title', args: 1, 'Titulo del push', required: true
    r longOpt: 'redirect', args: 1, 'Pagina a abrir con el push (dash, chats o account)', required: true
}

def options = cli.parse(args)

// Claves y endpoint para enviar notificaciones en Android
final androidService = "https://android.googleapis.com"
final androidAuthKey = "AIzaSyDPmJxFhoxf3VbHCfvoWNeQOmfh0GqRJSE"

def msgBody = [ 
    registration_ids: [options.t],
    data: [
        message: options.m,
        title: options.a,
        redirect: options.r,
        bigview: true,
    ]
]


def http = new HTTPBuilder( androidService )
http.request(POST) {
    headers.'Authorization' = "key=${androidAuthKey}"
    uri.path = "/gcm/send"
    requestContentType = 'application/json'
    body = msgBody

    response.success = { resp, data ->
        if(data.failure) {
            if(data.results[0].error == "NotRegistered") {
                println "El dispositivo no esta registrado"
            }
        }
        println "Notificacion Android enviada ${data}"
        
    }

    response.failure = { resp, data ->
        println "Error sending notification. (${resp.statusLine}) ${data}"
    }
}