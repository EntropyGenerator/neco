# shell.nix
{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  name = "nodejs22";
  
  buildInputs = with pkgs; [
    nodejs_22
    npm-check-updates
  ];
  shellHook = '''';
}