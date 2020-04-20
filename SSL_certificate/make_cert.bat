rem ’†ŠÔ‚ª‚È‚¢‚ÆChrome‚ÅŽó‚¯•t‚¯‚È‚¢–Í—l
rem C:\OpenSSL-Win32\bin\openssl.exe req -newkey rsa:4096 -keyout fst-ar.key -x509 -nodes -out fst-ar.crt -subj "/CN=fst-ar.svr" -reqexts SAN -extensions SAN -config openssl-san.cnf -days 3650

C:\OpenSSL-Win32\bin\openssl.exe genrsa 2048 > fst-ar.key
C:\OpenSSL-Win32\bin\openssl.exe req -new -key fst-ar.key -subj "/C=JP/ST=dev/O=NEW/CN=fst-ar.svr" > fst-ar.csr
C:\OpenSSL-Win32\bin\openssl.exe x509 -days 3650 -req -extfile subj.txt -signkey fst-ar.key < fst-ar.csr > fst-ar.crt

C:\OpenSSL-Win32\bin\openssl.exe x509 -in fst-ar.crt -text -noout

pause
