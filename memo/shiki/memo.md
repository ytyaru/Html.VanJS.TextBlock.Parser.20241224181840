# Shiki

```sh
ROOT="shiki-test"
mkdir "$ROOT"
cd "$ROOT"
npm init -y
npm install typescript
npm install @types/node
npm install shiki

```

```sh
npx tsc index.ts --lib ES2023 --lib dom --target es2015
```

```sh
index.ts:1:28 - error TS2792: Cannot find module 'shiki'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

1 import { codeToHtml } from "shiki";
                             ~~~~~~~

node_modules/@types/node/globals.d.ts:6:76 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

6 type _Request = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").Request;
                                                                             ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:7:77 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

7 type _Response = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").Response;
                                                                              ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:8:77 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

8 type _FormData = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").FormData;
                                                                              ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:9:76 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

9 type _Headers = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").Headers;
                                                                             ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:10:81 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

10 type _MessageEvent = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").MessageEvent;
                                                                                   ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:12:14 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

12     : import("undici-types").RequestInit;
                ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:14:14 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

14     : import("undici-types").ResponseInit;
                ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:15:78 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

15 type _WebSocket = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").WebSocket;
                                                                                ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:16:80 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

16 type _EventSource = typeof globalThis extends { onmessage: any } ? {} : import("undici-types").EventSource;
                                                                                  ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:519:25 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

519         : typeof import("undici-types").Request;
                            ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:528:25 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

528         : typeof import("undici-types").Response;
                            ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:535:25 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

535         : typeof import("undici-types").FormData;
                            ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:542:25 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

542         : typeof import("undici-types").Headers;
                            ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:552:25 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

552         : typeof import("undici-types").MessageEvent;
                            ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:556:25 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

556         : typeof import("undici-types").WebSocket;
                            ~~~~~~~~~~~~~~

node_modules/@types/node/globals.d.ts:565:25 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

565         : typeof import("undici-types").EventSource;
                            ~~~~~~~~~~~~~~

node_modules/@types/node/http.d.ts:1946:29 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

1946     const WebSocket: import("undici-types").WebSocket;
                                 ~~~~~~~~~~~~~~

node_modules/@types/node/http.d.ts:1950:30 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

1950     const CloseEvent: import("undici-types").CloseEvent;
                                  ~~~~~~~~~~~~~~

node_modules/@types/node/http.d.ts:1954:32 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

1954     const MessageEvent: import("undici-types").MessageEvent;
                                    ~~~~~~~~~~~~~~


Found 20 errors in 3 files.

Errors  Files
     1  index.ts:1
    16  node_modules/@types/node/globals.d.ts:6
     3  node_modules/@types/node/http.d.ts:1946
```

