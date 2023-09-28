using System;
using System.Collections.Generic;
using Sirenix.OdinInspector;
using UnityEngine;

[CreateAssetMenu(fileName = "CustomInventery", menuName = "SO/Inventery/NewInventery")]
public class InventerySO : SerializedScriptableObject
{
    public Dictionary<ItemSO, int> InventeryItems = new Dictionary<ItemSO, int>();
    public Action OnNewItemAdded, OnNewItemRemoved;

    public void AddToInventery(ItemSO itemToAdd, int quantity)
    {
        if (quantity < 1) return;
        if (IsAvailableOnInventery(itemToAdd)) InventeryItems[itemToAdd] += quantity;
        else InventeryItems.Add(itemToAdd, quantity);
        OnNewItemAdded?.Invoke();
    }

    public void AddOneToInventery(ItemSO itemToAdd)
    {
        if (IsAvailableOnInventery(itemToAdd)) InventeryItems[itemToAdd] += 1;
        else InventeryItems.Add(itemToAdd, 1);
        OnNewItemAdded?.Invoke();
    }

    public bool TryRemoveFromInventery(ItemSO itemToRemove, int quandity)
    {
        if (IsAvailableOnInventery(itemToRemove))
        {
            if (GetAvailableQuandityOnInventery(itemToRemove) > quandity)
            {
                InventeryItems[itemToRemove] -= quandity;
                OnNewItemRemoved?.Invoke();
                return true;
            }
            else if (GetAvailableQuandityOnInventery(itemToRemove) == quandity)
            {
                InventeryItems.Remove(itemToRemove);
                OnNewItemRemoved?.Invoke();
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    public bool IsAvailableOnInventery(ItemSO itemToSearch)
    {
        return InventeryItems.ContainsKey(itemToSearch);
    }

    public int GetAvailableQuandityOnInventery(ItemSO itemToSearch)
    {
        if (IsAvailableOnInventery(itemToSearch)) return InventeryItems[itemToSearch];
        else return -1;
    }

    public void RemoveAllItems()
    {
        InventeryItems.Clear();
    }
}