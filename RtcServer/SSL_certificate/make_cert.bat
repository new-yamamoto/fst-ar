rem c:\OpenSSL-Win32\bin\openssl.exe req -newkey rsa:4096 -keyout fst-ar-rtc.key -x509 -nodes -out fst-ar-rtc.crt -subj "/CN=fst-ar.rtc" -reqexts SAN -extensions SAN -config openssl-san.cnf -days 3650

C:\OpenSSL-Win32\bin\openssl.exe genrsa 2048 > fst-ar-rtc.key
C:\OpenSSL-Win32\bin\openssl.exe req -new -key fst-ar-rtc.key -subj "/C=JP/ST=dev/O=NEW/CN=fst-ar.rtc" > fst-ar-rtc.csr
C:\OpenSSL-Win32\bin\openssl.exe x509 -days 3650 -req -extfile subj.txt -signkey fst-ar-rtc.key < fst-ar-rtc.csr > fst-ar-rtc.crt

C:\OpenSSL-Win32\bin\openssl.exe x509 -in fst-ar-rtc.crt -text -noout
pause

