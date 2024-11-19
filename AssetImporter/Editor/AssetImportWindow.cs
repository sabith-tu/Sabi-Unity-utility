using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

public class AssetImportWindow : EditorWindow
{
    private Dictionary<string, bool> importToggles = new Dictionary<string, bool>();
    private Vector2 assetStoreScrollPosition = Vector2.zero;

    [MenuItem("Project Setup/Asset Importer")]
    public static void ShowWindow()
    {
        GetWindow<AssetImportWindow>("Asset Importer");
    }

    private void OnEnable()
    {
        // Initialize toggles
        importToggles.Clear();
        foreach (var asset in UnityAssetLocations.AssetStore)
        {
            importToggles[asset.Key] = false;
        }
        foreach (var asset in UnityAssetLocations.Sabi)
        {
            importToggles[asset.Key] = false;
        }
    }

    private void OnGUI()
    {
        GUILayout.Space(10);
        EditorGUILayout.LabelField("Select Assets to Import", EditorStyles.boldLabel);
        GUILayout.Space(10);

        if (GUILayout.Button("Import Selected Assets", GUILayout.Height(40)))
        {
            ImportSelectedAssets();
        }

        GUILayout.Space(10);

        SABI();
        GUILayout.Space(10);

        AssetStore();
    }

    private void AssetStore()
    {
        bool assetStoreFoldout = EditorPrefs.GetBool("AssetStoreFoldout", false);
        assetStoreFoldout = EditorGUILayout.Foldout(assetStoreFoldout, "Asset Store");
        EditorPrefs.SetBool("AssetStoreFoldout", assetStoreFoldout);
        if (assetStoreFoldout)
        {
            assetStoreScrollPosition = EditorGUILayout.BeginScrollView(assetStoreScrollPosition);
            foreach (var asset in UnityAssetLocations.AssetStore)
            {
                importToggles[asset.Key] = EditorGUILayout.ToggleLeft(
                    asset.Key,
                    importToggles[asset.Key]
                );
            }
            EditorGUILayout.EndScrollView();
        }
    }

    private void SABI()
    {
        bool sabiFoldout = EditorPrefs.GetBool("SABIFoldout", false);
        sabiFoldout = EditorGUILayout.Foldout(sabiFoldout, "Sabi");
        EditorPrefs.SetBool("SABIFoldout", sabiFoldout);
        if (sabiFoldout)
        {
            foreach (var asset in UnityAssetLocations.Sabi)
            {
                importToggles[asset.Key] = EditorGUILayout.ToggleLeft(
                    asset.Key,
                    importToggles[asset.Key]
                );
            }
        }
    }

    private void ImportSelectedAssets()
    {
        foreach (var toggle in importToggles)
        {
            if (toggle.Value)
            {
                string assetPath;
                if (UnityAssetLocations.AssetStore.ContainsKey(toggle.Key))
                {
                    assetPath = UnityAssetLocations.AssetStore[toggle.Key];
                }
                else if (UnityAssetLocations.Sabi.ContainsKey(toggle.Key))
                {
                    assetPath = UnityAssetLocations.Sabi[toggle.Key];
                }
                else
                {
                    Debug.LogError($"Asset key {toggle.Key} not found in any dictionary");
                    continue;
                }
                ProjectInitialization.ImportAsset(assetPath);
            }
        }
    }
}
