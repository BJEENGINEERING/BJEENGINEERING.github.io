<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = htmlspecialchars($_POST['nama']);
    $telepon = htmlspecialchars($_POST['telepon']);
    $layanan = htmlspecialchars($_POST['layanan']);
    $deskripsi = htmlspecialchars($_POST['deskripsi']);

    // Buat folder uploads jika belum ada
    $folder = "uploads/";
    if (!file_exists($folder)) {
        mkdir($folder, 0755, true);
    }

    $file_info = "";
    if (!empty($_FILES['lampiran']['name'])) {
        $nama_file = basename($_FILES['lampiran']['name']);
        $target = $folder . time() . "_" . $nama_file;
        if (move_uploaded_file($_FILES['lampiran']['tmp_name'], $target)) {
            $file_info = "File berhasil diupload: <a href='$target'>$nama_file</a>";
        } else {
            $file_info = "File gagal diupload.";
        }
    }

    // Simpan data ke file .txt
    $data = "=== Pesanan Baru ===\n";
    $data .= "Nama: $nama\n";
    $data .= "Telepon: $telepon\n";
    $data .= "Layanan: $layanan\n";
    $data .= "Deskripsi:\n$deskripsi\n";
    $data .= "Lampiran: $file_info\n\n";

    file_put_contents("data-pesanan.txt", $data, FILE_APPEND);

    echo "<h3>✅ Data berhasil dikirim!</h3>";
    echo "<p><a href='index.html'>← Kembali ke Formulir</a></p>";
}
?>
